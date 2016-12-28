import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { authPropType } from '../../lib/propTypes'
import NavBar from '../../components/NavBar'
import 'normalize.css/normalize.css'
import 'open-color/open-color.css'
import './styles.css'

class Layout extends React.Component {
  render () {
    return (
      <div className='Container'>
        <Helmet
          htmlAttributes={{lang: 'en'}}
          title='Energy'
          meta={[
              { name: 'description', content: 'Energy consumption power.' }
          ]}
        />
        <NavBar auth={this.props.auth} />
        <div className='Content'>
          {this.props.children }
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
})

Layout.propTypes = {
  children: React.PropTypes.any,
  auth: authPropType
}

export default connect(mapStateToProps)(Layout)
