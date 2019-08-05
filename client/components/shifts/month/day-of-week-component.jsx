import React from 'react';
class DayOfWeek extends React.Component {
 render() {
  return (
   <div style={{
    'display': 'inline-block',
    'width': '16vmin',
    'height': '16vmin',
    'margin': '0',
    'border': '2px solid black'
   }}>{this.props.dataFromWeekOfMonth}</div>
  );
 }
}
export default DayOfWeek;
