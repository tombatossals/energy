import React from 'react'
import moment from 'moment'
import { Link, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getWattsByInterval, getLocations } from '../../actions'
import Chart from '../../components/Chart'
import DatePicker from '../../components/DatePicker'
import Button from '../../components/Button'
import { Intervals } from '../../lib/constants'
import './styles.css'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.dateSelected = this.dateSelected.bind(this)
    this.locationSelected = this.locationSelected.bind(this)
  }

  componentDidMount () {
    this.props.getLocations()

    if (this.props.match.params.location) {
      const { interval, date } = this.props.match.params
      this.props.getWattsByInterval(this.props.match.params.location, moment(date), interval)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { interval, date, location } = this.props.match.params
    if (date !== prevProps.match.params.date ||
        interval !== prevProps.match.params.interval ||
        location !== prevProps.match.params.location) {
      this.props.getWattsByInterval(location, moment(date), interval)
    }
  }

  dateSelected (date) {
    const { interval, location } = this.props.match.params
    this.props.push(`/dashboard/${location}/interval/${interval}/date/${date.format('YYYYMMDD')}`)
  }

  upperFirst (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  locationSelected (ev) {
    const { interval, date } = this.props.match.params
    this.props.push(`/dashboard/${ev.target.value}/interval/${interval}/date/${date}`)
  }

  render () {
    if (!this.props.match.params.location && this.props.locations.data.length === 1) {
      const { interval, date } = this.props.match.params
      return <Redirect to={`/dashboard/${this.props.locations.data[0]}/interval/${interval}/date/${date}`} />
    }

    return (
      <div className='Dashboard'>
        <div className='Bar'>
          <div className='select'>
            <select onChange={this.locationSelected} value={this.props.match.params.location}>
              <option>Select Location:</option>
              {this.props.locations.data.map(location =>
                <option key={location.id} value={location.id}>{ location.name }</option>
              )}
            </select>
            <div className='select__arrow' />
          </div>
          { this.props.match.params.location &&
            <div>
              <div className='DatePicker'>
                <DatePicker
                  interval={this.props.match.params.interval}
                  initialVisibleMonth={() => moment(this.props.match.params.date)}
                  date={moment(this.props.match.params.date)}
                  onDateSelected={this.dateSelected}
                />
              </div>
              <div className='Menu'>
                <div className='MenuItem'>
                  {Object.values(Intervals).map(interval =>
                    <Link className='NoUnderline' key={interval} to={`/dashboard/${this.props.match.params.location}/interval/${interval}/date/${this.props.match.params.date}`}>
                      <Button active={this.props.match.params.interval === interval}>
                        {this.upperFirst(interval)}
                      </Button>
                    </Link>
                  )}
                </div>
                <div className='MenuItem Title'>Energy consumption</div>
              </div>
            </div>
          }
        </div>
        { this.props.match.params.location &&
          <div className='ChartContainer'>
            <Chart watt={this.props.watt} interval={this.props.match.params.interval} />
          </div>
        }
      </div>
    )
  }
}

Dashboard.propTypes = {
  getWattsByInterval: React.PropTypes.func.isRequired,
  getLocations: React.PropTypes.func.isRequired,
  watt: React.PropTypes.object,
  locations: React.PropTypes.object,
  match: React.PropTypes.shape({
    params: React.PropTypes.shape({
      date: React.PropTypes.string.isRequired,
      interval: React.PropTypes.string.isRequired,
      location: React.PropTypes.string
    })
  }),
  push: React.PropTypes.func.isRequired,
  location: React.PropTypes.object
}

Dashboard.contextTypes = {
  router: React.PropTypes.object
}

const mapStateToProps = ({ watt, locations }) => ({
  watt,
  locations
})

export default withRouter(connect(mapStateToProps, { getWattsByInterval, getLocations })(Dashboard))
