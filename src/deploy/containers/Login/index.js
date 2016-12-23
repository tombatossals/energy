import React from 'react'
import { connect } from 'react-redux'
import { authenticate } from '../../actions'
import './styles.css'
import google from './google.svg'

const Login = (props) => 
  <div className='Login'>
    <div className='Login-box' onClick={props.authenticate}>
      <img src={google} /> Iniciar Sesión con Google
    </div>
  </div>

export default connect(null, { authenticate })(Login)
