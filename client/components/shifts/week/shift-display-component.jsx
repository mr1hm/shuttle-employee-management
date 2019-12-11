import React from 'react';
import { checkPropTypes } from 'prop-types';

export default function ShiftDisplayComponent(props) {
  return (
    <div
      className={`weekdayShift rounded border h-75 ${props.shift.scheduled ? 'scheduled' : ''} ${props.shift.posted ? 'posted' : ''}`}
      style={{ width: props.width }}
    >
    </div>
  );
}
