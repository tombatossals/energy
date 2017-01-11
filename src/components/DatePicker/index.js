import React from 'react'
import moment from 'moment'
import { DayPicker, MonthPicker } from '@tombatossals/react-dates'
import { Intervals } from '../../lib/constants'
import '@tombatossals/react-dates/lib/css/_datepicker.css'
import './styles.css'

const isSameInterval = (a, b, interval) =>
  moment.isMoment(a) && moment.isMoment(b) && a.isSame(b, interval)

class CustomDatePicker extends React.Component {
  constructor (props) {
    super(props)
    this.onDateClick = this.onDateClick.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.getComponent = this.getComponent.bind(this)
    this.state = {
      hoverDate: null
    }
  }

  onDateClick (date) {
    this.props.onDateSelected(date)
  }

  onMouseEnter (date) {
    this.setState({ hoverDate: date })
  }

  onMouseLeave () {
    this.setState({
      hoverDate: null
    })
  }

  getComponent () {
    const modifiers = {
      selected: date => isSameInterval(this.props.date, date, this.props.interval),
      hovered: date => isSameInterval(this.state.hoverDate, date, this.props.interval),
      past: date => date.isAfter(moment().subtract(2, 'day'))
    }

    return {
      [Intervals.DAY]: <DayPicker
        id={this.props.interval}
        onDayClick={this.onDateClick}
        modifiers={modifiers}
        onDayMouseEnter={this.onMouseEnter}
        onDayMouseLeave={this.onMouseLeave}
        {...this.props}
      />,
      [Intervals.WEEK]: <DayPicker
        id={this.props.interval}
        onDayClick={this.onDateClick}
        enableOutsideDays
        modifiers={modifiers}
        onDayMouseEnter={this.onMouseEnter}
        onDayMouseLeave={this.onMouseLeave}
        {...this.props}
      />,
      [Intervals.MONTH]: <MonthPicker
        id={this.props.interval}
        initialVisibleYear={this.props.date}
        onMonthClick={this.onDateClick}
        modifiers={modifiers}
        onMonthMouseEnter={this.onMouseEnter}
        onMonthMouseLeave={this.onMouseLeave}
        {...this.props}
      />,
      [Intervals.YEAR]: <MonthPicker
        id={this.props.interval}
        initialVisibleYear={this.props.date}
        onMonthClick={this.onDateClick}
        modifiers={modifiers}
        onMonthMouseEnter={this.onMouseEnter}
        onMonthMouseLeave={this.onMouseLeave}
        {...this.props}
      />
    }[this.props.interval]
  }

  render () {
    return this.getComponent()
  }
}

CustomDatePicker.propTypes = {
  interval: React.PropTypes.oneOf(Object.values(Intervals)),
  date: React.PropTypes.object.isRequired,
  onDateSelected: React.PropTypes.func.isRequired
}

export default CustomDatePicker
