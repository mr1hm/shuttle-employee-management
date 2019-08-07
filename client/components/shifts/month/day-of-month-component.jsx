import React from 'react';

class DayOfMonth extends React.Component {
  render() {
    return (
      <div class={this.props.today}>
        {this.props.dayIndex}
        <div class={this.props.shifts}></div>
      </div>
    );
  } 
}

export default DayOfMonth;