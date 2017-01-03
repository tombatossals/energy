import React from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { getWattsByInterval } from '../../actions'
import Chart from '../../components/Chart'
import DatePicker from '../../components/DatePicker'
import Button from '../../components/Button'
import { Intervals } from '../../lib/constants'
import './styles.css'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.dateSelected = this.dateSelected.bind(this)
  }

  componentDidMount () {
    this.props.getWattsByInterval(moment(this.props.params.date), this.props.params.interval)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.params.date !== prevProps.params.date ||
        this.props.params.interval !== prevProps.params.interval) {
      this.props.getWattsByInterval(moment(this.props.params.date), this.props.params.interval)
    }
  }

  dateSelected (date) {
    this.context.router.transitionTo(`/dashboard/interval/day/date/${date.format('YYYYMMDD')}`)
  }

  upperFirst (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  render () {
    return (
      <div className='Dashboard'>
        <div className='Bar'>
          <div className='DatePicker'>
            <DatePicker
              interval={this.props.params.interval}
              initialVisibleMonth={() => moment(this.props.params.date)}
              date={moment(this.props.params.date)}
              onDateSelected={this.dateSelected}
            />
          </div>
          <div className='Menu'>
            <div className='MenuItem'>
              {Object.values(Intervals).map(interval =>
                <Link key={interval} className='NoUnderline' to={`/dashboard/interval/${interval}/date/${this.props.params.date}`}>
                  <Button active={this.props.params.interval === interval}>{this.upperFirst(interval)}</Button>
                </Link>
              )}
            </div>
            <div className='MenuItem Title'>Energy consumption</div>
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
  getWattsByInterval: React.PropTypes.func.isRequired,
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

export default connect(mapStateToProps, { getWattsByInterval })(Dashboard)
