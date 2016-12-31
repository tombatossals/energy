import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { getWattsByDay } from '../../actions'
import Chart from '../../components/Chart'
import DatePicker from '../../components/DatePicker'
import Button from '../../components/Button'
import './styles.css'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.dateSelected = this.dateSelected.bind(this)
    this.state = {
      showDatePicker: false,
      day: moment()
    }
  }

  componentDidMount () {
    this.props.getWattsByDay(this.state.day.subtract(2, 'day'))
  }

  dateSelected (date) {
    this.props.getWattsByDay(date)
    this.setState({
      day: date
    })
  }

  render () {
    return (
      <div className='Dashboard'>
        <div className='Bar'>
          <div className='DatePicker'>
            <DatePicker
              inline
              selected={this.state.day}
              onChange={this.dateSelected}
            />
          </div>
          <div className='Menu'>
            <div className='MenuItem'>
              <Button>Day</Button>
              <Button>Week</Button>
              <Button>Month</Button>
              <Button>Year</Button>
            </div>
            <div className='MenuItem Filler' />
            <div className='MenuItem Title'>
            Energy consumption
            </div>
          </div>
        </div>
        <div className='ChartContainer'>
          <Chart watt={this.props.watt} />
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  getWattsByDay: React.PropTypes.func.isRequired,
  watt: React.PropTypes.object
}

const mapStateToProps = ({ watt }) => ({
  watt
})

export default connect(mapStateToProps, { getWattsByDay })(Dashboard)
