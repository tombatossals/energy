import React from 'react'
import Helmet from 'react-helmet'
import NavBar from '../NavBar'
import './styles.css'

class Layout extends React.Component {
  render () {
    return (
      <div className="container">
        <Helmet
          htmlAttributes={{lang: 'en'}}
          title='Energy'
          meta={[
              { name: 'description', content: 'Energy consumption power.' }
          ]}
        />
        <NavBar {...this.props } />
        {this.props.children }
      </div>
    )
  }
}

export default Layout
