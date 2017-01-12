import firebase from 'firebase'
import moment from 'moment'
import { Intervals } from '../lib/constants'
import { getClientConfig } from './config'

const config = getClientConfig().firebase

firebase.initializeApp(config)
export const getFirebase = () => firebase

const hoursOfDay = (date) => {
  const current = date.clone().startOf('day')
  const end = date.clone().endOf('day')
  const hours = [ current.toISOString() ]

  while (current.isBefore(end)) {
    current.add(1, 'hour')
    hours.push(current.toISOString())
  }

  return hours
}

const daysOfWeek = (date) => {
  const current = date.clone().startOf('week')
  const end = date.clone().endOf('week')
  const days = [ current.toISOString() ]

  while (current.isBefore(end)) {
    current.add(1, 'day')
    days.push(current.toISOString())
  }

  return days
}

const weeksOfMonth = (date) => {
  const current = date.clone().startOf('month')
  const end = date.clone().endOf('month')
  const weeks = [ current.toISOString() ]

  while (current.isBefore(end)) {
    current.add(1, 'week')
    weeks.push(current.toISOString())
  }

  return weeks
}

const monthsOfYear = (date) => {
  const current = date.clone().startOf('year')
  const end = date.clone().endOf('year')
  const months = [ current.toISOString() ]

  while (current.isBefore(end)) {
    current.add(1, 'month')
    months.push(current.toISOString())
  }

  return months
}

const groupByWeekDay = measures => {
  const result = {}
  for (let measure of Object.values(measures)) {
    result.hasOwnProperty(measure.date)
      ? result[measure.date].value += measure.value
      : result[measure.date] = {
        date: moment(measure.time).format('YYYYMMDD'),
        time: moment(measure.time).endOf('day').toISOString(),
        value: measure.value
      }
  }
  return Object.values(result).slice().sort((t1, t2) => moment(t1.time) - moment(t2.time))
}

const groupByMonthWeek = measures => {
  const result = {}
  for (let measure of Object.values(measures)) {
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
  for (let measure of Object.values(measures)) {
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
  Object.values(measures).slice().sort((t1, t2) => moment(t1.time) - moment(t2.time))

const groupMeasures = {
  [Intervals.DAY]: groupByHourDay,
  [Intervals.WEEK]: groupByWeekDay,
  [Intervals.MONTH]: groupByMonthWeek,
  [Intervals.YEAR]: groupByYearMonth
}

const zeroMeasures = {
  [Intervals.DAY]: hoursOfDay,
  [Intervals.WEEK]: daysOfWeek,
  [Intervals.MONTH]: weeksOfMonth,
  [Intervals.YEAR]: monthsOfYear
}

export const getWatts = (interval, date, location, db) =>
  new Promise((resolve, reject) =>
    db.ref(`measures/${location}/${interval}`)
      .orderByChild('date')
      .startAt(date.clone().startOf(interval).format('YYYYMMDD'))
      .endAt(date.endOf(interval).format('YYYYMMDD')).once('value').then(measures =>
        measures.val()
        ? resolve(groupMeasures[interval](measures.val()))
        : resolve(zeroMeasures[interval](date).map(time => ({ time, value: 0 })))
  ))

const getFirstLocation = locations => Object.keys(locations.val().locations)[0]

const getUID = () => firebase.auth().currentUser.uid

const db = firebase.database()

export const getWattsByInterval = (date, interval) =>
  new Promise((resolve, reject) =>
    db.ref(`users/${getUID()}`).once('value', locations =>
      db.ref(`measures/${getFirstLocation(locations)}/${interval}`)
        .orderByChild('date')
        .startAt(date.clone().startOf(interval).format('YYYYMMDD'))
        .endAt(date.clone().endOf(interval).format('YYYYMMDD')).once('value')
        .then(measures =>
          console.log(measures.val()) && resolve(Object.values(measures.val()).slice().sort((t1, t2) => 
            moment(t1.time) - moment(t2.time))))
    )
  )
