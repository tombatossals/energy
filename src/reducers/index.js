import { combineReducers } from 'redux'
import auth from './auth'
import watt from './watt'

export default combineReducers({
  auth,
  watt
})
