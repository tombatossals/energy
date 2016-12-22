import { handleActions } from 'redux-actions'
import { AsyncStatus, AuthActions } from '../lib/constants'

const initialAuthState = {
  authenticated: false
}

export default handleActions({
  [AuthActions.AUTH_USER_LOGIN]: (state, action) => {
    switch (action.payload.status) {
      case AsyncStatus.FAILED:
        return {
          status: AsyncStatus.FAILED,
          message: action.payload.message
        }
      case AsyncStatus.REQUEST:
        return {
          status: AsyncStatus.REQUEST
        }
      case AsyncStatus.SUCCESS:
        return {
          status: AsyncStatus.SUCCESS,
          data: action.payload.data
        }
      default:
        return state
    }
  }
}, initialAuthState)
