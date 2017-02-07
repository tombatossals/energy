import firebase from 'firebase-admin'
import { getWatts } from './firebase'
import { getServerConfig } from '../lib/config'

const firebaseConfig = getServerConfig().import.firebase

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig.credentials),
  databaseURL: firebaseConfig.databaseURL
})

export const getFirebaseAdmin = () => firebase

const db = firebase.database()

export const addUserLocation = (user, location, description) =>
  db.ref(`users/${user}/locations/${location}`).set(description)

export const addMeasures = (location, measures) =>
  Promise.all(measures.map(measure => getRefLocation(location, 'day').push(measure)))

const getRefLocation = (location, interval) => db.ref(`measures/${location}/${interval}`)

export const removeMeasuresByDate = (location, date, interval = 'day') =>
  getRefLocation(location, interval)
    .orderByChild('date')
    .equalTo(date.format('YYYYMMDD'))
    .once('value', snapshot =>
      snapshot.val()
        ? Object.keys(snapshot.val()).reduce((prev, key) =>
            prev.then(getRefLocation(location, interval).child(key).remove().transaction), Promise.resolve())
        : Promise.resolve()
  )

export const cleanCache = location =>
  new Promise((resolve, reject) =>
    Promise.all([
      db.ref(`measures/${location}`).child('year').remove(resolve),
      db.ref(`measures/${location}`).child('month').remove().transaction,
      db.ref(`measures/${location}`).child('week').remove().transaction
    ])
  )


export const addMeasuresByInterval = (location, date, interval) =>
  Promise.all([
    removeMeasuresByDate(location, date, interval),
    getWatts(interval, date, db.ref(`measures/${location}/day`))
  ]).then(([_, measures]) =>
      Promise.all(measures.map(measure =>
        measure.value > 0 && db.ref(`measures/${location}/${interval}`).push(measure).transaction))
  )
