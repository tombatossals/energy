import React from 'react'
import { connect } from 'react-redux'
import { authenticate } from '../../actions'
import { AsyncStatus } from '../../lib/constants'
import Button from '../../components/Button'
import Spinner from '../../components/Spinner'
import './styles.css'
import google from './google.svg'

const Login = (props) =>
  <div className={`Login ${(props.auth.status !== AsyncStatus.SUCCESS || props.auth.authenticated) ? 'disabled' : ''}`}>
    { props.auth.status === AsyncStatus.REQUEST &&
      <Spinner />
    }

    <Button onClick={props.authenticate} color='Green'>
      <img role='presentation' className='GoogleIcon' src={google} /> Iniciar Sesión con Google
    </Button>
  </div>

Login.propTypes = {
  auth: React.PropTypes.shape({
    status: React.PropTypes.oneOf(Object.values(AsyncStatus)),
    authenticated: React.PropTypes.bool.isRequired
  }).isRequired,
  authenticate: React.PropTypes.func.isRequired
}

const mapStateToProps = ({ auth }) => ({
  auth
})

export default connect(mapStateToProps, { authenticate })(Login)
