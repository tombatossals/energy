import {
  addMeasuresByInterval,
  cleanCache
} from '../../lib/firebase-admin'
import moment from 'moment'
import { getServerConfig } from '../../lib/config'
import { getWatts } from '../../lib/firebase'

const { contract } = getServerConfig().collect.iberdrola

if (process.argv.length < 3) process.exit(-1)

if (process.argv[2] === 'clean') {
  cleanCache(contract).then(() => setTimeout(() => process.exit(), 5000))
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
