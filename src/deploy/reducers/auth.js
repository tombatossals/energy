import { handleActions } from 'redux-actions'
import { AsyncStatus, AuthActions } from '../lib/constants'
import jwtDecode from 'jwt-decode'

const checkTokenExpiry = () => {
  const jwt = localStorage.getItem('id_token')
  if (jwt) {
    const jwtExp = jwtDecode(jwt).exp;
    const expiryDate = new Date(0);
    expiryDate.setUTCSeconds(jwtExp);

    return new Date() < expiryDate
  }
  return false;  
}

const initialState = {
  authenticated: checkTokenExpiry(),
  status: AsyncStatus.IDLE,
  user: {},
  error: undefined
}

const userLogin = (state, action) => {
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

export default handleActions({
  [AuthActions.AUTH_USER_LOGIN]: userLogin
}, initialState)
