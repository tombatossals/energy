import React from 'react'
import { AsyncStatus } from '../../lib/constants'
import { VictoryChart, VictoryArea, VictoryAxis, VictoryLine, VictoryTheme } from 'victory'
import Spinner from '../../components/Spinner'

export default class Chart extends React.Component {
  render () {
    if (this.props.data.status !== AsyncStatus.SUCCESS) {
      return <Spinner />
    }

    return (
      <VictoryChart
        theme={VictoryTheme.material}
        width={500}
        height={300}
        responsive={false}
      >
        <VictoryAxis
          dependentAxis
        />
        <VictoryAxis
          tickValues={this.props.data.xaxis}
          tickFormat={(y) => {
            return (y % 2) ? this.props.data.xaxis[y - 1] : ''
          }}
          style={{
            axisLabel: {fontSize: 16, padding: 20},
            grid: {stroke: 'grey'},
            ticks: {stroke: 'grey'},
            tickLabels: {fontSize: 10, padding: 5, angle: 25}
          }}
        />
        <VictoryArea
          data={this.props.data.data}
          style={{
            data: {
              fill: 'blue',
              opacity: 0.4,
              width: 16.5
            }
          }}
        />
        <VictoryLine
          label='Kwh'
          data={this.props.data.data}
          style={{
            data: { opacity: 0.7, stroke: '#e95f46', strokeWidth: 4 }
          }}
          x='month'
          y='profit'
        />

      </VictoryChart>
    )
  }
}

Chart.propTypes = {
  data: React.PropTypes.object.isRequired
}
