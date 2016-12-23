import React from 'react'
import { connect } from 'react-redux'
import { authenticate } from '../../actions'
import './styles.css'

const Login = (props) => 
  <div className='Login'>
    <div className='Login-box'>
      <button type="button" onClick={props.authenticate} className="pt-button pt-large pt-icon-add">Login with Google</button>
    </div>
  </div>

export default connect(null, { authenticate })(Login)
