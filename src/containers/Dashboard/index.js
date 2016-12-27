import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { getMeasuresByDay } from '../../actions'
import { AsyncStatus } from '../../lib/constants'
import Chart from '../../components/Chart'
import Button from '../../components/Button'
import DatePicker from '../../components/DatePicker'
import InfiniteCalendar from 'react-infinite-calendar'
import './styles.css'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showDatePicker: false,
      day: moment()
    }
  }

  componentDidMount () {
    this.props.getMeasuresByDay(this.state.day.subtract(2, 'day'))
  }

  showDatePicker = () => {
    this.setState({
      showDatePicker: true
    })
  }

  hideDatePicker = () => {
    this.setState({
      showDatePicker: false
    })
  }

  dateSelected = (date) => {
    this.props.getMeasuresByDay(date)
    this.hideDatePicker();
    this.setState({
      day: date
    })
  }

  render () {
    return (
      <div className='Dashboard'>
        <div className='Bar'>
          <h1>Dashboard</h1>
          <Button
            onClick={this.showDatePicker}
            className='DatePicker'
          >
            Select Date
          </Button>
        </div>
        <h2>{ this.state.day.format("dddd, MMMM Do YYYY, h:mm:ss a") }</h2>
        { this.props.measure.status === AsyncStatus.FAILED
          ? <div>{ this.props.measure.error }</div>
          : <div className='Chart'><Chart data={this.props.measure} /></div>
        }
        <InfiniteCalendar
          height={400}
          onSelect={this.props.onSelect}
          maxDate={moment().subtract(2, 'day')}
          max={moment().subtract(2, 'day')}
        />

        { this.state.showDatePicker && <DatePicker onClose={this.hideDatePicker} onSelect={this.dateSelected} /> }
      </div>
    )
  }
}

Dashboard.propTypes = {
  getMeasuresByDay: React.PropTypes.func.isRequired,
  measure: React.PropTypes.object
}

const mapStateToProps = ({ measure }) => ({
  measure
})

export default connect(mapStateToProps, { getMeasuresByDay })(Dashboard)
