import React from 'react'
import { connect } from 'react-redux'
import { authenticate } from '../../actions'
import { AsyncStatus } from '../../lib/constants'
import './styles.css'
import google from './google.svg'
import spinner from '../../assets/spinning-loader.svg'

const Login = (props) =>
  <div className='Login'>
    { props.auth.status !== AsyncStatus.SUCCESS
        ? <img role='presentation' className='Spinner' src={spinner} />
        : <div className='Login-box' onClick={props.authenticate}>
          <img role='presentation' src={google} /> Iniciar Sesión con Google
          </div>
      }
  </div>

const mapStateToProps = ({ auth }) => ({
  auth
})

export default connect(mapStateToProps, { authenticate })(Login)
