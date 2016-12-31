import React from 'react'
import './styles.css'

const Button = (props) =>
  <div className={`Button ${props.color} ${props.icon ? 'Icon' : ''}`} onClick={props.onClick}>
    { props.icon && <div className='Icon'><img role='presentation' src={props.icon} /></div> }
    {props.children}
  </div>

Button.propTypes = {
  color: React.PropTypes.oneOf([ 'Blue', 'Green', 'Yellow', 'Red' ]),
  children: React.PropTypes.any.isRequired,
  onClick: React.PropTypes.func,
  icon: React.PropTypes.string
}

Button.defaultProps = {
  color: 'Blue'
}

export default Button
