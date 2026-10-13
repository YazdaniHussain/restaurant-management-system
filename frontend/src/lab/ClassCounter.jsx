// src/lab/ClassCounter.jsx
// 2a - Counter button using a React CLASS component (standalone lab version).
import React from 'react';
import { Label } from '../labels/labels.js';   // labels helper

export default class ClassCounter extends React.Component {
  state = { count: 0 };                         // class state

  // Here we update the state when the button is clicked
  handleClick = () => this.setState({ count: this.state.count + 1 });

  render() {
    return (
      <div className="card">
        <h4>2a. Class component counter <Label id="2a" /></h4>
        <button className="btn btn-primary" onClick={this.handleClick}>Clicked {this.state.count} times</button>
      </div>
    );
  }
}
