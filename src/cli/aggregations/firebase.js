import admin from 'firebase-admin'
import moment from 'moment'
import { getServerConfig } from '../../lib/config'
import { getWatts } from '../../lib/firebase'
import { Intervals } from '../../lib/constants'
const firebaseConfig = getServerConfig().import.firebase

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig.credentials),
  databaseURL: firebaseConfig.databaseURL
})

const db = admin.database()

const removeMeasuresByDateKey = (ref, date) =>
  ref.orderByChild('date')
    .equalTo(date.format('YYYYMMDD'))
    .once('value', snapshot =>
      snapshot.val()
        ? Object.keys(snapshot.val()).reduce((prev, key) =>
            prev.then(ref.child(key).remove()), Promise.resolve())
        : Promise.resolve()
  )

const addMeasuresByInterval = (location, date, interval) =>
  new Promise((resolve, reject) =>
    removeMeasuresByDateKey(db.ref(`measures/${location}/${interval}`), date).then(() =>
      getWatts(interval, date, db.ref(`measures/${location}/day`)).then(measures =>
        resolve(measures.map(measure =>
          measure.value > 0 && db.ref(`measures/${location}/${interval}`).push(measure).key)
        )
      )
    )
  )

const { contract } = getServerConfig().collect.iberdrola

if (process.argv.length < 3) process.exit(-1)

if (process.argv[2] === 'clean') {
  db.ref(`measures/${contract}/year`).set([]).then(() =>
    db.ref(`measures/${contract}/month`).set([])).then(() =>
      db.ref(`measures/${contract}/week`).set([]))
        .then(() => setTimeout(() => process.exit(), 5000))
} else {
  const date = moment(process.argv[2], 'YYYY').startOf('year')
  let current = date.clone()
  const promises = []

  while (current.year() === date.year()) {
    promises.push(addMeasuresByInterval(contract, current.clone(), 'week'))
    current.add(1, 'week')
  }

  current = date.clone()
  while (current.year() === date.year()) {
    promises.push(addMeasuresByInterval(contract, current.clone(), 'month'))
    current.add(1, 'month')
  }

  promises.push(addMeasuresByInterval(contract, date.clone(), 'year'))

  Promise.all(promises)
    .then(() => setTimeout(() => process.exit(), 5000))
}
