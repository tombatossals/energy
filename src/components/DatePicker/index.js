import React from 'react'
import { DayPicker } from 'react-dates';
import moment from 'moment'
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

export default CustomDatePicker
