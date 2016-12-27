import React from 'react'
import spinner from './spinning-loader.svg'
import './styles.css'

const Spinner = (props) =>
  <img
    role='presentation'
    className='Spinner'
    src={spinner}
    style={{
      maxWidth: props.maxWidth
    }}
  />

Spinner.propTypes = {
  maxWidth: React.PropTypes.string
}

Spinner.defaultProps = {
  maxWidth: 'auto'
}

export default Spinner
