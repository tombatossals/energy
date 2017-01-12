import admin from 'firebase-admin'
import moment from 'moment'
import { getServerConfig } from '../../lib/config'
import { getWatts } from '../../lib/firebase'
const firebaseConfig = getServerConfig().import.firebase

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig.credentials),
  databaseURL: firebaseConfig.databaseURL
})

const db = admin.database()

const removeMeasuresByDateKey = (ref, date) =>
  ref.orderByChild('date')
    .equalTo(date.format('YYYYMMDD'))
    .once('value', snapshot => {
      if (snapshot.val()) {
        return Object.keys(snapshot.val()).reduce((prev, key) =>
          prev.then(ref.child(key).remove()), Promise.resolve())
      }
      return Promise.resolve()
    }
  )

const addMeasuresByInterval = (location, date, interval) =>
  removeMeasuresByDateKey(db.ref(`measures/${location}/${interval}`), date).then(() =>
    getWatts(interval, date, location, db).then(data =>
      data.map(measure => db.ref(`measures/${location}/${interval}`).push(measure))))


let year = moment()
const { contract } = getServerConfig().collect.iberdrola

if (process.argv.length === 3) {
  if (moment.isMoment(process.argv[2]), 'YYYY') {
    year = moment(process.argv[2], 'YYYY').startOf('year')
  }
  getWatts('week', year, contract, db).then(data =>
    console.log(data)
  ).then(process.exit)
} else if (process.argv.length === 2) {
  Promise.all([
    addMeasuresByInterval(contract, year, 'year'),
    addMeasuresByInterval(contract, year, 'month'),
    addMeasuresByInterval(contract, year, 'week')
  ]).then(process.exit)
} else {
   db.ref(`measures/${contract}/year`).set([]).then(() =>
    db.ref(`measures/${contract}/month`).set([])).then(() =>
      db.ref(`measures/${contract}/week`).set([])).then(() =>
        process.exit())
}
