import { AsyncStatus, AuthActions } from '../lib/constants'
import { createAction } from 'redux-actions'
import firebase from '../lib/firebase'

export const logout = () =>
  dispatch => {
    const logoutAction = createAction(UserActions.AUTH_USER_LOGOUT)
    firebase.auth().signOut().then(() =>
      dispatch(logoutAction({
        status: AsyncStatus.SUCCESS
      }))
    )
  }
