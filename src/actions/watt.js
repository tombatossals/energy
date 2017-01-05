import moment from 'moment'
import { AsyncStatus, DataActions, Intervals } from '../lib/constants'
import { createAction } from 'redux-actions'
import { getFirebase } from '../lib/firebase'

const firebase = getFirebase()

const ticks = {
  day: [ '00:00:00', '01:00:00', '02:00:00', '03:00:00', '04:00:00', '05:00:00', '06:00:00', '07:00:00', '08:00:00', '09:00:00',
    '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00',
    '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00' ]
}

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

const emailToKey = email => email.replace(/[.]/g, '%20')

const getWattsByDay = (date, location) =>
  new Promise((resolve, reject) =>
    firebase.database().ref(`measures/${location}`).orderByChild('date').equalTo(date.format('YYYYMMDD')).once('value').then(measures =>
      measures.val() && Object.keys(measures.val()).length === 24
        ? resolve(Object.values(measures.val()).slice().sort((t1, t2) => moment(t1.time) - moment(t2.time)))
        : resolve(hoursOfDay(date).map(time => ({ time, value: 0 })))
    ))

const getWattsByMonth = (date, location) =>
  new Promise((resolve, reject) =>
    firebase.database().ref(`measures/${location}`).orderByChild('date').startAt(date.format('YYYYMM')).once('value').then(measures =>
      measures.val() && Object.keys(measures.val()).length === 24
        ? resolve(Object.values(measures.val()).slice().sort((t1, t2) => parseInt(t1.time.split(':')[0], 10) - parseInt(t2.time.split(':'), 10)))
        : resolve(ticks.day.map(time => ({ time, value: 0 })))  
  ))

export const getWattsByInterval = (date, interval) =>
  dispatch => {
    const getWatts = createAction(DataActions.DATA_FETCH)
    dispatch(getWatts({
      status: AsyncStatus.REQUEST,
      data: [],
      error: undefined
    }))

    var user = firebase.auth().currentUser
    firebase.database().ref(`users/${emailToKey(user.email)}`).once('value', locations => {
      const location = Object.keys(locations.val().locations)[0]

      const getWatts = interval === Intervals.DAY
        ? getWattsByDay
        : getWattsByMonth

      const getWattsAction = createAction(DataActions.DATA_FETCH)
      getWatts(date, location).then(data =>
        dispatch(getWattsAction({
          status: AsyncStatus.SUCCESS,
          data,
          error: undefined
        }))
      )
    })
  }
