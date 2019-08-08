import React from 'react';

class DayOfMonth extends React.Component {
  


  render() {

    if(this.props.shiftStatus.length !== 0){
      return (
        <div class={this.props.today}>
          {this.props.dayIndex}
          <div class={this.props.shifts}>{console.log(this.props.shiftStatus[0].status)}</div>
        </div>
      );
    } 
    return (
      <div class={this.props.today}>
        {this.props.dayIndex}
        {/* <div class={this.props.shifts}></div> */}
      </div>
    );
  } 
}

export default DayOfMonth;