import {
  addMeasuresByInterval,
  cleanCache
} from '../../lib/firebase-admin'
import moment from 'moment'
import { getServerConfig } from '../../lib/config'
import cla from 'command-line-args'

const config = getServerConfig().collect.iberdrola
const locations = config[Object.keys(config)[0]].locations

const { clean, location, year } = cla([
  { name: 'year', type: Number, multiple: false, defaultOption: true, defaultValue: moment().year() },
  { name: 'clean', type: Boolean, defaultValue: false },
  { name: 'location', alias: 'l', type: String }
])

if (clean) {
  cleanCache(location).then(() => setTimeout(() => process.exit(), 5000))
} else {
  const date = moment(year, 'YYYY')
  let current = date.clone().startOf('year')
  const promises = []

  for (let location of locations) {
    console.log(`Generating cache of location ${location.name} for the year ${date.year()}...`)
    while (current.week() <= date.week()) {
      promises.push(addMeasuresByInterval(location.id, current.clone(), 'week'))
      current.add(1, 'week')
    }

    current = date.clone().startOf('year')
    while (current.month() <= date.month()) {
      promises.push(addMeasuresByInterval(location.id, current.clone(), 'month'))
      current.add(1, 'month')
    }

    promises.push(addMeasuresByInterval(location.id, date.clone().startOf('year'), 'year'))
  }

  Promise.all(promises)
    .then(() => setTimeout(() => process.exit(), 5000))
}
