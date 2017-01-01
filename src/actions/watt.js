import { AsyncStatus, DataActions } from '../lib/constants'
import { createAction } from 'redux-actions'
import { getFirebase } from '../lib/firebase'

const firebase = getFirebase()

const ticks = {
  daily: [ '01:00h', '02:00h', '03:00h', '04:00h', '05:00h', '06:00h', '07:00h', '08:00h', '09:00h',
    '10:00h', '11:00h', '12:00h', '13:00h', '14:00h', '15:00h', '16:00h', '17:00h', '18:00h',
    '19:00h', '20:00h', '21:00h', '22:00h', '23:00h', '24:00h' ]
}

const emailToKey = email => email.replace(/[.]/g, '%20')

export const getWattsByInterval = (date, interval) =>
  dispatch => {
    const getWatts = createAction(DataActions.DATA_FETCH)
    dispatch(getWatts({
      status: AsyncStatus.REQUEST,
      data: [],
      error: undefined
    }))

    var user = firebase.auth().currentUser
    firebase.database().ref(emailToKey(user.email)).startAt(0).once('child_added', (measures) => {
      console.log(measures)
      const getWatts = createAction(DataActions.DATA_FETCH)
      if (measures.val()) {
        return dispatch(getWatts({
          status: AsyncStatus.SUCCESS,
          data: measures.val().values.map((measure, index) => ({ x: ticks['daily'][index], y: measure })),
          error: undefined
        }))
      }

      return dispatch(getWatts({
        status: AsyncStatus.FAILED,
        data: ticks.daily.map(hour => ({ x: hour, y: 0 })),
        error: 'No data available'
      }))
    })
  }
