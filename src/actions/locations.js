import { AsyncStatus, DataActions } from '../lib/constants'
import { createAction } from 'redux-actions'
import * as fb from '../lib/firebase'

export const getLocations = (userId) =>
  dispatch => {
    const getLocationsAction = createAction(DataActions.DATA_FETCH)
    dispatch(getLocationsAction({
      status: AsyncStatus.REQUEST,
      data: [],
      error: undefined
    }))

    fb.getLocations().then(data =>
      dispatch(getLocationsAction({
        status: AsyncStatus.SUCCESS,
        data,
        error: undefined
      }))
    )
  }
