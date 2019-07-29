import React from 'react';

function DayOfWeek() {
  return (
    <div style={{
      'display': 'inline-block',
      'width': '16vmin',
      'height': '16vmin',
      'margin': '0',
      'border': '2px solid black'
    }}>{props.dataFromWeekOfMonth}</div>
  );
}

export default DayOfWeek;
