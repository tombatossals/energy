import { handleActions } from 'redux-actions'
import { AsyncStatus, DataActions } from '../lib/constants'

const initialState = {
  status: AsyncStatus.IDLE,
  data: [],
  error: undefined
}

const fetchData = (state, action) => {
  switch (action.payload.status) {
    case AsyncStatus.FAILED:
      return action.payload
    case AsyncStatus.REQUEST:
      return { ...state, status: action.payload.status }
    case AsyncStatus.SUCCESS:
      return action.payload
    default:
      return state
  }
}

export default handleActions({
  [DataActions.LOCATION_DATA_FETCH]: fetchData
}, initialState)
