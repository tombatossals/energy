import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { getMeasuresByDay } from '../../actions'
import Chart from '../../components/Chart'
import Button from '../../components/Button'
import Calendar from 'rc-calendar'
import 'rc-calendar/assets/index.css'
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
    console.log('date')
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
          <h2>Dashboard</h2>
          <Button
            onClick={this.showDatePicker}
            className='DatePicker'
          >
            Select Date
          </Button>
        </div>
        <div className='ChartContainer'>
          <Chart data={this.props.measure} />
          <div className='Calendar'>
            <Calendar
              onSelect={this.dateSelected}
              showToday={false}
            />
          </div>
        </div>
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
