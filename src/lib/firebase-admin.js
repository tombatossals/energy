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
            prev.then(getRefLocation(location, interval).child(key).remove()), Promise.resolve())
        : Promise.resolve()
  )

export const cleanCache = location =>
  Promise.all([
    db.ref(`measures/${location}/year`).set([]).transaction,
    db.ref(`measures/${location}/month`).set([]).transaction,
    db.ref(`measures/${location}/week`).set([]).transaction
  ])


export const addMeasuresByInterval = (location, date, interval) =>
  new Promise((resolve, reject) =>
    removeMeasuresByDate(location, date, interval).then(() =>
      getWatts(interval, date, db.ref(`measures/${location}/day`)).then(measures =>
        resolve(measures.map(measure =>
          measure.value > 0 && db.ref(`measures/${location}/${interval}`).push(measure).key)
        )
      )
    )
  )

