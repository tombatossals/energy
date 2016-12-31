import React from 'react'
import spinner from './spinning-loader.svg'
import './styles.css'

const Spinner = (props) =>
  <img
    role='presentation'
    className={`Spinner ${!props.show && 'Hide'}`}
    src={spinner}
    style={{
      maxWidth: props.maxWidth
    }}
  />

Spinner.propTypes = {
  maxWidth: React.PropTypes.string,
  show: React.PropTypes.bool
}

Spinner.defaultProps = {
  maxWidth: 'auto',
  show: true
}

export default Spinner
