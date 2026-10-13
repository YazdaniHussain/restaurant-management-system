// src/components/GuestCounter.jsx
// 2a - A counter button built with a React CLASS component.
// It counts the number of guests for a dine-in order and tells the parent through props.
import React from 'react';
import { Label } from '../labels/labels.js';   // labels helper

export default class GuestCounter extends React.Component {
  // Here we keep the count in the class "state"
  constructor(props) {
    super(props);
    this.state = { count: props.initial || 1 };
    this.increase = this.increase.bind(this);    // bind so "this" works inside the handler
    this.decrease = this.decrease.bind(this);
  }

  // setState updates the count; then we inform the parent component
  increase() {
    this.setState(
      (prev) => ({ count: Math.min(prev.count + 1, 12) }),
      () => this.props.onChange && this.props.onChange(this.state.count)
    );
  }
  decrease() {
    this.setState(
      (prev) => ({ count: Math.max(prev.count - 1, 1) }),
      () => this.props.onChange && this.props.onChange(this.state.count)
    );
  }

  // render() returns what is shown in the browser
  render() {
    return (
      <span className="counter">
        <button type="button" className="btn btn-small" onClick={this.decrease}>-</button>
        <strong className="counter-value">{this.state.count}</strong>
        <button type="button" className="btn btn-small" onClick={this.increase}>+</button>
        <Label id="2a" note="class component counter (guests)" />
      </span>
    );
  }
}
