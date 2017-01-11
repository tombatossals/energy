import { AsyncStatus, DataActions } from '../lib/constants'
import { createAction } from 'redux-actions'
import * as firebase from '../lib/firebase'

export const getWattsByInterval = (date, interval) =>
  dispatch => {
    const getWattsAction = createAction(DataActions.DATA_FETCH)
    dispatch(getWattsAction({
      status: AsyncStatus.REQUEST,
      data: [],
      error: undefined
    }))

    firebase.getWattsByInterval(date, interval).then(data =>
      dispatch(getWattsAction({
        status: AsyncStatus.SUCCESS,
        data,
        error: undefined
      }))
    )
  }
