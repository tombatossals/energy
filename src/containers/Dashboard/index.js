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
  }

  componentDidMount () {
    this.props.getWattsByDay(moment(this.props.params.date))
  }


  componentDidUpdate (prevProps, prevState) {
    if (this.props.params.date !== prevProps.params.date) {
      this.props.getWattsByDay(moment(this.props.params.date))
    }
  }

  dateSelected (date) {
    this.context.router.transitionTo(`/dashboard/interval/day/date/${date.format('YYYYMMDD')}`)
  }

  render () {
    return (
      <div className='Dashboard'>
        <div className='Bar'>
          <div className='DatePicker'>
            <DatePicker
              inline
              selected={moment(this.props.params.date)}
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
  watt: React.PropTypes.object,
  location: React.PropTypes.object,
  pathname: React.PropTypes.string.isRequired,
  params: React.PropTypes.shape({
    interval: React.PropTypes.string.isRequired,
    date: React.PropTypes.string.isRequired
  })
}

Dashboard.contextTypes = {
  router: React.PropTypes.object
}

const mapStateToProps = ({ watt }) => ({
  watt
})

export default connect(mapStateToProps, { getWattsByDay })(Dashboard)
