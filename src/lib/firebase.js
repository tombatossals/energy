import firebase from 'firebase'
import moment from 'moment'
import { Intervals } from '../lib/constants'
import { getClientConfig } from './config'

const config = getClientConfig().firebase

firebase.initializeApp(config)
export const getFirebase = () => firebase

const previousInterval = {
  year: 'month',
  month: 'week',
  week: 'day',
  day: 'hour'
}

const sortMeasures = measures =>
  measures.slice().sort((t1, t2) => moment(t1.time) - moment(t2.time))

const initialInterval = (date, interval) => {
  const current = date.clone().startOf(interval)
  const end = date.clone().endOf(interval)
  const measures = {}

  while (current.isBefore(end)) {
    current.add(1, previousInterval[interval])
    measures[current.toISOString()] = {
      date: current.format('YYYYMMDD'),
      time: current.toISOString(),
      value: 0
    }
  }

  return Object.values(measures)
}

const groupByWeekDay = measures => {
  const result = {}
  for (let measure of measures) {
    result.hasOwnProperty(measure.date)
      ? result[measure.date].value += measure.value
      : result[measure.date] = {
        date: moment(measure.time).startOf('day').format('YYYYMMDD'),
        time: moment(measure.time).endOf('day').toISOString(),
        value: measure.value
      }
  }
  return Object.values(result).slice().sort((t1, t2) => moment(t1.time) - moment(t2.time))
}

const groupByMonthWeek = measures => {
  const result = {}
  for (let measure of measures) {
    result.hasOwnProperty(moment(measure.time).startOf('week').format('MMDD'))
      ? result[moment(measure.time).startOf('week').format('MMDD')].value += measure.value
      : result[moment(measure.time).startOf('week').format('MMDD')] = {
        date: moment(measure.time).startOf('week').format('YYYYMMDD'),
        time: moment(measure.time).startOf('week').toISOString(),
        value: measure.value
      }
  }
  return Object.values(result).slice().sort((t1, t2) => moment(t1.time) - moment(t2.time))
}

const groupByYearMonth = measures => {
  const result = {}
  for (let measure of measures) {
    result.hasOwnProperty(moment(measure.time).startOf('month').format('MM'))
      ? result[moment(measure.time).startOf('month').format('MM')].value += measure.value
      : result[moment(measure.time).startOf('month').format('MM')] = {
        date: moment(measure.time).startOf('month').format('YYYYMMDD'),
        time: moment(measure.time).startOf('month').toISOString(),
        value: measure.value
      }
  }
  return Object.values(result).slice().sort((t1, t2) => moment(t1.time) - moment(t2.time))
}

const groupByHourDay = measures =>
  measures.slice().sort((t1, t2) => moment(t1.time) - moment(t2.time))

const groupMeasures = {
  [Intervals.DAY]: groupByHourDay,
  [Intervals.WEEK]: groupByWeekDay,
  [Intervals.MONTH]: groupByMonthWeek,
  [Intervals.YEAR]: groupByYearMonth
}

export const getWatts = (interval, date, ref) =>
  new Promise((resolve, reject) =>
      ref.orderByChild('date')
      .startAt(date.clone().startOf(interval).format('YYYYMMDD'))
      .endAt(date.clone().endOf(interval).format('YYYYMMDD')).once('value').then(measures =>
        measures.val()
        ? resolve(groupMeasures[interval](Object.values(measures.val())))
        : resolve(sortMeasures(initialInterval(date, interval)))
  ))

const getUID = () => firebase.auth().currentUser.uid

const db = firebase.database()

export const getWattsByInterval = (location, date, interval) =>
  new Promise((resolve, reject) =>
    db.ref(`measures/${location}/${interval}`)
      .orderByChild('date')
      .startAt(date.clone().startOf(interval).format('YYYYMMDD'))
      .endAt(date.clone().endOf(interval).format('YYYYMMDD'))
      .once('value')
      .then(measures =>
        measures.val()
        ? resolve(sortMeasures(Object.values(measures.val())))
        : resolve(sortMeasures(initialInterval(date, interval))))
  )

export const getLocations = () =>
  new Promise((resolve, reject) =>
    db.ref(`users/${getUID()}`).once('value', locations =>
      locations.val()
        ? resolve(Object.keys(locations.val().locations).map(loc => ({ id: loc, name: locations.val().locations[loc] })))
        : []
    )
  )
