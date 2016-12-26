import React from 'react'
import './styles.css'

const Button = (props) =>
  <div className={`Button ${props.color}`} onClick={props.onClick}>
    {props.children}
  </div>

Button.propTypes = {
  color: React.PropTypes.oneOf([ 'Blue', 'Green', 'Yellow', 'Red' ]),
  children: React.PropTypes.any.isRequired,
  onClick: React.PropTypes.func.isRequired
}

Button.defaultProps = {
  color: 'Blue'
}

export default Button
