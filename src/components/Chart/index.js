import React from 'react'
import { VictoryChart, VictoryAxis, VictoryLine, VictoryTheme } from 'victory'

export default class CustomTheme extends React.Component {
  render () {
    console.log(VictoryTheme.material)
    return (
      <VictoryChart
        theme={VictoryTheme.material}
        width={500}
        height={300}
        responsive={false}
      >
        <VictoryAxis
          dependentAxis
          tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        />
        <VictoryAxis
          tickValues={['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']}
        />
        <VictoryLine
          label='Kwh'
          interpolation='monotoneX'
          data={[
            {month: 'Ene', profit: 5.5},
            {month: 'Feb', profit: 3},
            {month: 'Mar', profit: 4.5},
            {month: 'Abr', profit: 1.2},
            {month: 'May', profit: 3}
          ]}
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
