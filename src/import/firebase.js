import firebase from 'firebase-admin'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import { getConfig } from '../common'

const config = getConfig().import.firebase

firebase.initializeApp({
  credential: firebase.credential.cert(config.credentials),
  databaseURL: config.databaseURL
})

const db = firebase.database()

const addJSON = (db, json) =>
  db.ref('measures/' + moment(json.date).format('YYYYMMDD')).set({ values: json.values })

fs.readdir('data', (err, list) => {
  if (err) {
    console.log('You must collect some data from a energy provider with the "collect" script')
    process.exit(-1)
  }

  let promises = list.map((file) =>
    new Promise((resolve, reject) =>
      fs.readFile(path.join('data', file), (err, data) => {
        if (err) return reject(err)
        resolve(addJSON(db, JSON.parse(data)))
      })
    )
  )

  Promise.all(promises).then(() => {
    process.exit()
  })
})
