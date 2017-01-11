import firebase from 'firebase-admin'
import fs from 'fs'
import path from 'path'
import { getConfig } from '../config'

const firebaseConfig = getConfig().import.firebase

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig.credentials),
  databaseURL: firebaseConfig.databaseURL
})

const db = firebase.database()

const flatten = list =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])

const stringToKey = str => str.replace(/[.]/g, '%20')

const addUserLocation = (db, user, location) =>
  db.ref(`users/${stringToKey(user)}/locations/${stringToKey(location)}`).set(true)

const addUserMeasures = (db, user, location, measures) =>
  db.ref(`measures/${stringToKey(location)}`).then(() =>
    measures.reduce((prev, measure) =>
      db.ref(`measures/${stringToKey(location)}/day`).push(measure)
    , Promise.resolve())
  )

if (process.argv.length > 2 && process.argv[2] === 'clean') {
  const { username, contract } = getConfig().collect.iberdrola
  addUserLocation(db, username, contract).then(() =>
    addUserMeasures(db, username, contract, []).then(process.exit)
  )
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

  const { username, contract } = getConfig().collect.iberdrola
  Promise.all(promises).then(dataArray =>
    addUserLocation(db, username, contract).then(() =>
      addUserMeasures(db, username, contract, flatten(dataArray)).then(process.exit)
  ))
})
