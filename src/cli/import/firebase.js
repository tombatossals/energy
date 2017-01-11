import firebase from 'firebase-admin'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import { getServerConfig } from '../../lib/config'

const firebaseConfig = getServerConfig().import.firebase

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

const removeMeasuresByDate = (ref, date) =>
  ref.orderByChild('date').equalTo(date.format('YYYYMMDD')).once('value', snapshot => {
    if (snapshot.val()) {
      return Object.keys(snapshot.val()).reduce((prev, key) =>
        prev.then(ref.child(key).remove()), Promise.resolve())
    }
    return Promise.resolve()
  })

const addMeasures = (ref, measures) =>
  Promise.all(measures.map(measure => ref.push(measure)))

const { username, contract } = getServerConfig().collect.iberdrola
if (process.argv.length > 2 && process.argv[2] === 'full') {
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

    return Promise.all(promises).then(dataArray =>
      addUserLocation(db, username, contract).then(() =>
        addMeasures(db, username, contract, flatten(dataArray)).then(process.exit)
    ))
  })
}

const filename = `${moment().subtract(2, 'day').format('DD-MM-YYYY')}.json`
fs.readFile(path.join('data', filename), (err, data) => {
  if (err) process.exit(-1)
  const measures = JSON.parse(data)
  const date = moment(measures[0].date)
  const ref = db.ref(`measures/${stringToKey(contract)}/day`)
  removeMeasuresByDate(ref, date)
    .then(() => addMeasures(ref, measures))
    .then(process.exit)
})
