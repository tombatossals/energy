import React from 'react'
import moment from 'moment'
import { AsyncStatus, Intervals } from '../../lib/constants'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Spinner from '../../components/Spinner'
import './styles.css'

const xformatter = {
  [Intervals.DAY]: time => `${moment(time).format('HH:mm')}h`,
  [Intervals.WEEK]: time => moment(time).format('DD MMM'),
  [Intervals.MONTH]: time => moment(time).format('DD-MMM-YYYY'),
  [Intervals.YEAR]: time => moment(time).format('MMM')
}

export default class Chart extends React.Component {

  render () {
    return (
      <div className='Chart'>
        <Spinner
          show={this.props.watt.status === AsyncStatus.REQUEST}
          maxWidth='120px'
        />
        <ResponsiveContainer>
          <AreaChart
            data={this.props.watt.data}
          >
            <defs>
              <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey='time'
              tickFormatter={xformatter[this.props.interval]}
            />
            <YAxis
              type='number'
              domain={['0', 'dataMax + 200']}
              tickFormatter={val => `${(val / 1000).toFixed(2)} Kw/h`}
            />
            <CartesianGrid strokeDasharray='3 3' />
            <Tooltip />
            <Area
              animationDuration={500}
              type='monotone'
              dataKey='value'
              stroke='#8884d8'
              fillOpacity={1}
              fill='url(#colorUv)' />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

Chart.propTypes = {
  watt: React.PropTypes.object.isRequired,
  interval: React.PropTypes.oneOf(Object.values(Intervals))
}
