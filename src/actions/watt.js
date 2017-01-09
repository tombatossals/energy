import moment from 'moment'
import { AsyncStatus, DataActions, Intervals } from '../lib/constants'
import { createAction } from 'redux-actions'
import { getFirebase } from '../lib/firebase'

const firebase = getFirebase()

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
        time: moment(measure.time).startOf('month').toISOString(),
        value: measure.value
      }
  }
  return Object.values(result).slice().sort((t1, t2) => moment(t1.time) - moment(t2.time))
}

const emailToKey = email => email.replace(/[.]/g, '%20')

const getWattsByDay = (date, location) =>
  new Promise((resolve, reject) =>
    firebase.database().ref(`measures/${location}`).orderByChild('date').equalTo(date.format('YYYYMMDD')).once('value').then(measures =>
      measures.val() && Object.keys(measures.val()).length === 24
        ? resolve(Object.values(measures.val()).slice().sort((t1, t2) => moment(t1.time) - moment(t2.time)))
        : resolve(hoursOfDay(date).map(time => ({ time, value: 0 })))
    ))

const getWattsByWeek = (date, location) =>
  new Promise((resolve, reject) =>
    firebase.database()
      .ref(`measures/${location}`)
      .orderByChild('date')
      .startAt(date.startOf('week').format('YYYYMMDD'))
      .endAt(date.endOf('week').format('YYYYMMDD')).once('value').then(measures =>
        measures.val()
        ? resolve(groupByWeekDay(measures.val()))
        : resolve(daysOfWeek(date).map(time => ({ time, value: 0 })))
  ))

const getWattsByMonth = (date, location) =>
  new Promise((resolve, reject) =>
    firebase.database()
      .ref(`measures/${location}`)
      .orderByChild('date')
      .startAt(date.startOf('month').format('YYYYMMDD'))
      .endAt(date.endOf('month').format('YYYYMMDD')).once('value').then(measures =>
        measures.val()
        ? resolve(groupByMonthWeek(measures.val()))
        : resolve(weeksOfMonth(date).map(time => ({ time, value: 0 })))
  ))

const getWattsByYear = (date, location) =>
  new Promise((resolve, reject) =>
    firebase.database()
      .ref(`measures/${location}`)
      .orderByChild('date')
      .startAt(date.startOf('year').format('YYYYMMDD'))
      .endAt(date.endOf('year').format('YYYYMMDD')).once('value').then(measures =>
        measures.val()
        ? resolve(groupByYearMonth(measures.val()))
        : resolve(monthsOfYear(date).map(time => ({ time, value: 0 })))
  ))

const getWatts = {
  [Intervals.DAY]: getWattsByDay,
  [Intervals.WEEK]: getWattsByWeek,
  [Intervals.MONTH]: getWattsByMonth,
  [Intervals.YEAR]: getWattsByYear
}

export const getWattsByInterval = (date, interval) =>
  dispatch => {
    const getWattsAction = createAction(DataActions.DATA_FETCH)
    dispatch(getWattsAction({
      status: AsyncStatus.REQUEST,
      data: [],
      error: undefined
    }))

    var user = firebase.auth().currentUser
    firebase.database().ref(`users/${emailToKey(user.email)}`).once('value', locations => {
      const location = Object.keys(locations.val().locations)[0]

      const getWattsAction = createAction(DataActions.DATA_FETCH)
      getWatts[interval](date, location).then(data =>
        dispatch(getWattsAction({
          status: AsyncStatus.SUCCESS,
          data,
          error: undefined
        }))
      )
    })
  }
