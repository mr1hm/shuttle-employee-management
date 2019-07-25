import React from 'react';

class CalendarDayComponent extends React.Component {
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

export default CalendarDayComponent;
