import { AsyncStatus, DataActions } from '../lib/constants'
import { createAction } from 'redux-actions'
import { getFirebase } from '../lib/firebase'

const firebase = getFirebase()

const ticks = {
  daily: [ '00:00:00', '01:00:00', '02:00:00', '03:00:00', '04:00:00', '05:00:00', '06:00:00', '07:00:00', '08:00:00', '09:00:00',
    '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00',
    '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00' ]
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
    firebase.database().ref(`users/${emailToKey(user.email)}`).once('value', locations => {
      const location = Object.keys(locations.val().locations)[0]
      firebase.database().ref(`measures/${location}`).orderByChild('date').equalTo(date.format('YYYYMMDD')).once('value', (measures) => {
        const getWatts = createAction(DataActions.DATA_FETCH)        
        if (measures.val()) {
          return dispatch(getWatts({
            status: AsyncStatus.SUCCESS,
            data: Object.values(measures.val()).slice().sort((t1, t2) => parseInt(t1.time.split(':')[0], 10) - parseInt(t2.time.split(':'), 10)),
            error: undefined
          }))
        }

        return dispatch(getWatts({
          status: AsyncStatus.FAILED,
          data: ticks.daily.map(hour => ({ x: hour, y: 0 })),
          error: 'No data available'
        }))
      })
    })
  }
