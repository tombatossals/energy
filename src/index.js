import React from 'react';
import ReactDOM from 'react-dom';
import App from './deploy/components';
import firebase from 'firebase'
import { getConfig } from './common'
import '../node_modules/@blueprintjs/core/dist/blueprint.css'

const config = getConfig().deploy.firebase
firebase.initializeApp(config)

ReactDOM.render(
  <App firebase={firebase} />,
  document.getElementById('root')
);
