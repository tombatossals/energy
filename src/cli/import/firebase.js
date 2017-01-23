import {
  addUserLocation,
  addMeasures,
  removeMeasuresByDate
} from '../../lib/firebase-admin'
import { getServerConfig } from '../../lib/config'
import moment from 'moment'
import fs from 'fs'
import path from 'path'

const flatten = list =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])

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
      removeMeasuresByDate(contract, dataArray[0].date).then(() =>
        addUserLocation(username, contract).then(() =>
          addMeasures(contract, flatten(dataArray)).then(process.exit)
        )
      )
    )
  }
)
}

const filename = `${moment().subtract(2, 'day').format('DD-MM-YYYY')}.json`
fs.readFile(path.join('data', filename), (err, data) => {
  if (err) process.exit(-1)
  const measures = JSON.parse(data)
  return removeMeasuresByDate(contract, moment(measures[0].date))
    .then(() => addMeasures(contract, measures))
    .then(process.exit)
})
