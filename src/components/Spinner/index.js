import React from 'react'
import spinner from './spinning-loader.svg'
import './styles.css'

export default () =>
  <img role='presentation' className='Spinner' src={spinner} />
