import React from 'react'
import { DayPicker } from 'react-dates'
import { Intervals } from '../../lib/constants'
import 'react-dates/lib/css/_datepicker.css'
import './styles.css'

const CustomDatePicker = (props) => {
  const onDayClick = (day, modifiers, e) =>
    props.onDateSelected(day)

  const onDayMouseEnter = (day, modifiers) => modifiers.push({ hover: true })
  return (
    <DayPicker
      id={`${props.interval}-picker`}
      onDayClick={onDayClick}
      modifiers={{ selected: (day) => {
        return props.date.startOf('day').isSame(day.startOf('day'))
      }}}
      onDayMouseEnter={onDayMouseEnter}
      {...props}
    />
  )
}

CustomDatePicker.propTypes = {
  interval: React.PropTypes.oneOf(Object.values(Intervals)),
  date: React.PropTypes.object.isRequired
}

export default CustomDatePicker
