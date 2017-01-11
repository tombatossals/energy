import firebase from 'firebase-admin'
import moment from 'moment'
import { getWattsByInterval} from '../../lib/firebase'
import { getServerConfig } from '../../lib/config'

const firebaseConfig = getServerConfig().import.firebase

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig.credentials),
  databaseURL: firebaseConfig.databaseURL
})

const db = firebase.database()

const calculateAggretationsByYear = (db, username, location, date) =>
  getWattsByInterval(date, 'day')

let year = moment()
if (process.argv.length > 2) {
  year = moment(process.argv[2])
}

const { username, contract } = getServerConfig().collect.iberdrola
calculateAggretationsByYear(db, username, contract, year).then(process.exit)

