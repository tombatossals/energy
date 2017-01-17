import { AsyncStatus, DataActions } from '../lib/constants'
import { createAction } from 'redux-actions'
import * as fb from '../lib/firebase'

export const getWattsByInterval = (location, date, interval) =>
  dispatch => {
    const getWattsAction = createAction(DataActions.DATA_FETCH)
    dispatch(getWattsAction({
      status: AsyncStatus.REQUEST,
      data: [],
      error: undefined
    }))

    fb.getWattsByInterval(location, date, interval).then(data =>
      dispatch(getWattsAction({
        status: AsyncStatus.SUCCESS,
        data,
        error: undefined
      }))
    )
  }
