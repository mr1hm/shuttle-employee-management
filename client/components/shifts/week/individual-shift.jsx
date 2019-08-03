import React from 'react';
import {
  convertUnixTime, convertUnixDateDay, convertUnixDateNumber, getShiftStartHour,
  getShiftStartMinute, getShiftEndHour, getShiftEndMinute, calculateDailyWorkingHours
} from '../../../lib/time-functions';

class IndividualShift extends React.Component {
  render() {
    return    this.props.shiftInfo.map(singleShiftObject => {
                const range = { min: 600, max: 2400 };
                const availableHours = (range.max - range.min)/100;
                const widthPerSlot = 100 / availableHours;
                const shiftTotalHours = calculateDailyWorkingHours(this.props.shiftInfo.startTime, this.props.shiftInfo.endTime);
                const timeSlots = widthPerSlot * (shiftTotalHours);
                const shiftWidth = timeSlots + "%";
                const leftStartTime = (parseFloat(this.props.shiftInfo.startTime) - range.min);
                const leftStartTimeSimpleHours = leftStartTime / 100;
                const shiftStartPosition = widthPerSlot *  leftStartTimeSimpleHours + '%';
                let shiftType = null;
                if (this.props.shiftInfo.posted === false){
                  shiftType = "scheduled"
                } else {
                  shiftType = "posted";
                }

          return (
            <div
              key={this.props.shiftInfo.shiftDate + this.props.shiftInfo.startTime + this.props.shiftInfo.endTime}
            className={`shift ${shiftType}`}
              style={{
                left: shiftStartPosition,
                width: shiftWidth
              }}>
            </div>)
        }

    }

export default IndividualShift;
