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

const removeMeasuresByDateKey = (ref, dateKey) =>
  ref.orderByChild('date')
    .equalTo(dateKey)
    .once('value', snapshot => {
      if (snapshot.val()) {
        return Object.keys(snapshot.val()).reduce((prev, key) =>
          prev.then(ref.child(key).remove()), Promise.resolve())
      }
      return Promise.resolve()
    }
  )

const addMeasuresByInterval = (db, uid, location, date, interval, dateKey) =>
  removeMeasuresByDateKey(db.ref(`measures/${location}/${interval}`), dateKey).then(() =>
    getWatts(interval, date, location, db).then(data =>
      data.map(measure => db.ref(`measures/${location}/${interval}`).push(measure))))


let year = moment()
if (process.argv.length > 2) {
  year = moment(process.argv[2])
}

const { username, contract } = getServerConfig().collect.iberdrola

const getUserUID = email =>
  admin.auth().getUserByEmail(username)

getUserUID(username).then(user =>
  Promise.all([
    addMeasuresByInterval(db, user.uid, contract, year, 'year', year.format('YYYYMM')),
    addMeasuresByInterval(db, user.uid, contract, year, 'month', year.format('YYYYMMDD')),
    addMeasuresByInterval(db, user.uid, contract, year, 'week', year.format('YYYYMMDD'))
  ])).then(process.exit)

