import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { authenticate } from '../../actions'
import { AsyncStatus } from '../../lib/constants'
import { authPropType } from '../../lib/propTypes'
import Button from '../../components/Button'
import Spinner from '../../components/Spinner'
import './styles.css'
import google from './google.svg'

class Login extends React.Component {

  constructor (props) {
    super(props)
    this.loginAndRedirect = this.loginAndRedirect.bind(this)
    this.state = {
      from: '/'
    }
  }

  componentDidMount () {
    if (this.props.location.state) {
      this.setState({
        from: this.props.location.state.from.pathname
      })
    }
  }

  loginAndRedirect () {
    this.props.authenticate(this.state.from)
  }

  render () {
    if (this.props.auth.authenticated) {
      return <Redirect to={this.state.from} />
    }

    return (
      <div className={`Login ${(this.props.auth.status !== AsyncStatus.SUCCESS || this.props.auth.authenticated) ? 'disabled' : ''}`}>
        { this.props.auth.status === AsyncStatus.REQUEST &&
          <Spinner />
        }

        <Button onClick={this.loginAndRedirect} color='Green' icon={google}>
          Iniciar Sesión con Google
        </Button>
      </div>
    )
  }
}

Login.propTypes = {
  auth: authPropType.isRequired,
  authenticate: React.PropTypes.func.isRequired,
  location: React.PropTypes.object
}

const mapStateToProps = ({ auth }) => ({
  auth
})

export default connect(mapStateToProps, { authenticate })(Login)
