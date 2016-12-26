import { combineReducers } from 'redux'
import auth from './auth'
import measure from './measure'

export default combineReducers({
  auth,
  measure
})
