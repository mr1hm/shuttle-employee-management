import React from 'react';

//this component renders a day block and adds the date to that block
//TODO: add <div> that adds the shiftsScheduled information. Pass this information down through props.
class DayOfWeek extends React.Component {
  render() {
    return (
      <div style={{
        'display': 'inline-block',
        'width': '16vmin',
        'height': '16vmin',
        'margin': '0',
        'border': '2px solid black'
      }}>{this.props.dataFromWeekOfMonth}{this.props.dayShiftsScheduled}</div>
    );
  }
}

export default DayOfWeek;

// dayShiftStatus() {
//   if (this.props.dataFromWeekPrototype.hours > 0) {
//     return 'x';
//   } else {
//     return '';
//   }
// }

