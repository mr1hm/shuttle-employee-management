import React from 'react';

export default class DayOfMonth extends React.Component {
  getDayOfMonth() {
    return (
      this.props.dataFromWeekPrototype.date.slice(-2)
    );
  }
  render() {
    return (
      <div style={{
        'display': 'inline-block',
        'width': '16vmin',
        'height': '16vmin',
        'margin': '0',
        'border': '2px solid black'
      }}>{this.getDayOfMonth()}</div>
    );
  }
}
