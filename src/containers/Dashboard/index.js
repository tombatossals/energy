import React from 'react'
import moment from 'moment'
import { Link, Redirect } from 'react-router'
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

    if (this.props.params.location) {
      this.props.getWattsByInterval(this.props.params.location, moment(this.props.params.date), this.props.params.interval)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.params.date !== prevProps.params.date ||
        this.props.params.interval !== prevProps.params.interval ||
        this.props.params.location !== prevProps.params.location) {
      this.props.getWattsByInterval(this.props.params.location, moment(this.props.params.date), this.props.params.interval)
    }
  }

  dateSelected (date) {
    this.context.router.transitionTo(`/dashboard/${this.props.params.location}/interval/${this.props.params.interval}/date/${date.format('YYYYMMDD')}`)
  }

  upperFirst (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  locationSelected(ev) {
    const { interval, date } = this.props.params    
    this.context.router.transitionTo(`/dashboard/${ev.target.value}/interval/${interval}/date/${date}`)
    console.log(`/dashboard/${ev.target.value}/interval/${interval}/date/${date}`)
  }

  render () {

    if (!this.props.params.location && this.props.locations.data.length === 1) {
      const { interval, date } = this.props.params
      return <Redirect to={`/dashboard/${this.props.locations.data[0]}/interval/${interval}/date/${date}`} />
    }

    return (
      <div className='Dashboard'>
        <div className='Bar'>
          <div className='select'>
            <select onChange={this.locationSelected} value={this.props.params.location}>
              <option>Select Location:</option>
              {this.props.locations.data.map(location =>
                <option key={location}>{ location }</option>
              )}
            </select>
            <div className='select__arrow' />
          </div>
          { this.props.params.location &&
            <div>
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
                    <Link className='NoUnderline' key={interval} to={`/dashboard/${this.props.params.location}/interval/${interval}/date/${this.props.params.date}`}>
                      <Button active={this.props.params.interval === interval}>
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
        { this.props.params.location &&
          <div className='ChartContainer'>
            <Chart watt={this.props.watt} interval={this.props.params.interval} />
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
  pathname: React.PropTypes.string.isRequired,
  params: React.PropTypes.shape({
    interval: React.PropTypes.string.isRequired,
    date: React.PropTypes.string.isRequired,
    location: React.PropTypes.string
  })
}

Dashboard.contextTypes = {
  router: React.PropTypes.object
}

const mapStateToProps = ({ watt, locations }) => ({
  watt,
  locations
})

export default connect(mapStateToProps, { getWattsByInterval, getLocations })(Dashboard)
