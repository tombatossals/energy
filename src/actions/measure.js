import { AsyncStatus, DataActions } from '../lib/constants'
import { createAction } from 'redux-actions'
import { getFirebase } from '../lib/firebase'

const firebase = getFirebase()

export const getMeasuresByDay = (date) =>
  dispatch => {
    const getMeasures = createAction(DataActions.DATA_FETCH)
    dispatch(getMeasures({
      status: AsyncStatus.REQUEST,
      data: undefined,
      error: undefined
    }))

    firebase.database().ref(`measures/${date.format('YYYYMMDD')}`).once('value').then((data) => {
      const getMeasures = createAction(DataActions.DATA_FETCH)

      return dispatch(getMeasures({
        status: AsyncStatus.SUCCESS,
        data: data.val().values,
        xaxis: [ '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00',
          '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
          '20:00', '21:00', '22:00', '23:00', '00:00' ],
        error: undefined
      }))
    })
  }
