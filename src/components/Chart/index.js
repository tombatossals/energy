import React from 'react'
import { AsyncStatus } from '../../lib/constants'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Spinner from '../../components/Spinner'
import './styles.css'

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
                <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#fff' stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <XAxis dataKey='x' />
            <YAxis />
            <CartesianGrid strokeDasharray='3 3' />
            <Tooltip />
            <Area type='monotone' dataKey='y' stroke='#8884d8' fillOpacity={1} fill='url(#colorUv)' />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

Chart.propTypes = {
  watt: React.PropTypes.object.isRequired
}
