import React, { Component } from "react";
import "./App.css";
import CongressDistrict from './charts/map/congressdistrict'

class App extends Component {
  render() {
    return (
       <svg width="960" height="600">
        <CongressDistrict width="960" height="600" />
       </svg>
    );
  }
}

export default App;