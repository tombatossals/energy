import React from 'react'
import { DayPicker, MonthPicker } from '@tombatossals/react-dates'
import { Intervals } from '../../lib/constants'
import '@tombatossals/react-dates/lib/css/_datepicker.css'
import './styles.css'

const CustomDatePicker = (props) => {
  const onDateClick = (date, modifiers, e) =>
    props.onDateSelected(date)

  const onMouseEnter = (date, modifiers) => modifiers.push({ hover: true })
  return (
    props.interval === Intervals.DAY
    ? <DayPicker
      id={`${props.interval}-picker`}
      onDayClick={onDateClick}
      modifiers={{ selected: (day) => {
        return props.date.startOf('day').isSame(day.startOf('day'))
      }}}
      onDayMouseEnter={onMouseEnter}
      {...props}
    />
    : props.interval === Intervals.WEEK
      ? <DayPicker
        id={`${props.interval}-picker`}
        onDayClick={onDateClick}
        enableOutsideDays
        modifiers={{ selected: (day) => {
          return props.date.clone().startOf('week').isSame(day.clone().startOf('week'))
        }}}
        onDayMouseEnter={onMouseEnter}
        {...props}
      />
      : props.interval === Intervals.MONTH
        ? <MonthPicker
          id={`${props.interval}-picker`}
          initialVisibleYear={props.date}
          onMonthClick={onDateClick}
          modifiers={{ selected: (month) => {
            return props.date.startOf('month').isSame(month.startOf('month'))
          }}}
          onMonthMouseEnter={onMouseEnter}
          {...props}
        />
        : <MonthPicker
          id={`${props.interval}-picker`}
          initialVisibleYear={props.date}
          onMonthClick={onDateClick}
          modifiers={{ selected: (month) => {
            return props.date.startOf('year').isSame(month.clone().startOf('year'))
          }}}
          onMonthMouseEnter={onMouseEnter}
          {...props}
        />
  )
}

CustomDatePicker.propTypes = {
  interval: React.PropTypes.oneOf(Object.values(Intervals)),
  date: React.PropTypes.object.isRequired
}

export default CustomDatePicker
