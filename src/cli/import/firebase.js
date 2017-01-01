import firebase from 'firebase-admin'
import fs from 'fs'
import path from 'path'
import { getConfig } from '../config'

const userConfig = getConfig().collect.iberdrola
const firebaseConfig = getConfig().import.firebase

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig.credentials),
  databaseURL: firebaseConfig.databaseURL
})

const db = firebase.database()

const flatten = list =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])

const emailToKey = email => email.replace(/[.]/g, '%20')

const addJSON = (db, json) => {
  db.ref(`${emailToKey(userConfig.username)}/${userConfig.contract}`).set(json)
}

fs.readdir('data', (err, list) => {
  if (err) {
    console.log('You must collect some data from a energy provider with the "collect" script')
    process.exit(-1)
  }

  let promises = list.map((file) =>
    new Promise((resolve, reject) =>
      fs.readFile(path.join('data', file), (err, data) => {
        if (err) return reject(err)
        resolve(JSON.parse(data))
      })
    )
  )

  Promise.all(promises).then((dataArray) => {
    addJSON(db, flatten(dataArray))
  })
})
