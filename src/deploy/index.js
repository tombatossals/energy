import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Routes from './routes'
import configureStore from './lib/store'

export const renderApp = () =>
    ReactDOM.render(
      <Provider store={configureStore()}>
        <Routes />
      </Provider>,
        document.getElementById('root')
    )
