import {
  addMeasuresByInterval,
  cleanCache
} from '../../lib/firebase-admin'
import moment from 'moment'
import { getServerConfig } from '../../lib/config'
import cla from 'command-line-args'

const { location: defaultLocation } = getServerConfig().collect.iberdrola

const { clean, location, year } = cla([
  { name: 'year', type: Number, multiple: false, defaultOption: true, defaultValue: moment().year() },
  { name: 'clean', type: Boolean, defaultValue: false },
  { name: 'location', alias: 'l', type: String, defaultValue: defaultLocation }
])

if (clean) {
  cleanCache(location).then(() => setTimeout(() => process.exit(), 5000))
} else {
  const date = moment(year, 'YYYY')
  let current = date.clone().startOf('year')
  const promises = []

  while (current.week() <= date.week()) {
    promises.push(addMeasuresByInterval(location, current.clone(), 'week'))
    current.add(1, 'week')
  }

  current = date.clone().startOf('year')
  while (current.month() <= date.month()) {
    promises.push(addMeasuresByInterval(location, current.clone(), 'month'))
    current.add(1, 'month')
  }

  promises.push(addMeasuresByInterval(location, date.clone().startOf('year'), 'year'))

  Promise.all(promises)
    .then(() => setTimeout(() => process.exit(), 5000))
}
