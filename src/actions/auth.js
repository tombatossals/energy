import { AsyncStatus, AuthActions } from '../lib/constants'
import { createAction } from 'redux-actions'
import { getFirebase } from '../lib/firebase'

const firebase = getFirebase()

export const startAuthListener = () =>
  dispatch =>
    firebase.auth().onAuthStateChanged((user) => {
      const checkTokenAction = createAction(AuthActions.AUTH_CHECK_TOKEN)

      if (user) {
        return dispatch(checkTokenAction({
          status: AsyncStatus.SUCCESS,
          authenticated: true,
          user,
          error: undefined
        }))
      }

      return dispatch(checkTokenAction({
        status: AsyncStatus.SUCCESS,
        authenticated: false,
        user: undefined,
        error: undefined
      }))
    })

export const authenticate = (redirect = '/') =>
  dispatch => {
    const loginAction = createAction(AuthActions.AUTH_USER_AUTHENTICATE)
    dispatch(loginAction({
      status: AsyncStatus.REQUEST
    }))

    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    firebase.auth().signInWithPopup(provider).then(result => {
      const user = result.user
      dispatch(loginAction({
        status: AsyncStatus.SUCCESS,
        authenticated: true,
        user,
        redirect: redirect,
        error: undefined
      }))
    })
  }

export const logout = () =>
  dispatch => {
    const logoutAction = createAction(AuthActions.AUTH_USER_LOGOUT)
    dispatch(logoutAction({
      status: AsyncStatus.REQUEST,
      error: undefined
    }))

    firebase.auth().signOut()
  }
