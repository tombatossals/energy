import React, { Component } from 'react';
import NavBar from './components/navbar'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <NavBar />
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
