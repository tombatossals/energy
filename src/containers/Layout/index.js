import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import NavBar from '../../components/NavBar'
import 'normalize.css/normalize.css'
import 'open-color/open-color.css'
import './styles.css'

class Layout extends React.Component {
  render () {
    return (
      <div className='container'>
        <Helmet
          htmlAttributes={{lang: 'en'}}
          title='Energy'
          meta={[
              { name: 'description', content: 'Energy consumption power.' }
          ]}
        />
        <NavBar {...this.props} />
        {this.props.children }
      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
})

export default connect(mapStateToProps)(Layout)
