import { combineReducers } from 'redux'
import auth from './auth'
import watt from './watt'
import locations from './locations'

export default combineReducers({
  auth,
  watt,
  locations
})
