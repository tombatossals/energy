import { handleActions } from 'redux-actions'
import { AsyncStatus, AuthActions } from '../lib/constants'

const initialState = {
  authenticated: false,
  status: AsyncStatus.IDLE,
  user: {},
  error: undefined
}

const checkAuthentication = (state, action) => {
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
  [AuthActions.AUTH_USER_AUTHENTICATE]: checkAuthentication,
  [AuthActions.AUTH_CHECK_TOKEN]: checkAuthentication
}, initialState)
