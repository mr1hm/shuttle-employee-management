import React from 'react'
import IndividualShift from './individual-shift';
import { convertUnixTime, convertUnixDateDay, convertUnixDateNumber, getShiftStartHour,
  getShiftStartMinute, getShiftEndHour, getShiftEndMinute, calculateDailyWorkingHours, getTotalDayWorkingHours } from '../../../lib/time-functions';
class ShiftsWeekDay extends React.Component {

  // getTotalDayWorkingHours(startTime, EndTime) {
  //   let hourTotal = null;

  //   for (var numberOfShifts = 0; numberOfShifts < this.props.shifts.length; numberOfShifts++) {
  //     const hoursPerShift = calculateDailyWorkingHours(startTime, EndTime);
  //     hourTotal += hoursPerShift;
  //   }

  //   return hourTotal;
  // }
  render() {
      return (
        <div className="dayDataContainer">
          <div className="dayLabelContainer">
            <div className="dayText">{convertUnixDateDay(parseInt(this.props.shifts.shiftDate))}</div>
            <div className="dateText">{convertUnixDateNumber(parseInt(this.props.shifts.shiftDate))}</div>
            <div className="dayHours">{calculateDailyWorkingHours(this.props.shifts.startTime, this.props.shifts.endTime)} Hours</div>
          </div>
          <div className="dayRowContainer">
            <div className="dayRowFill">
              <IndividualShift shiftInfo={this.props.shifts} />
            </div>
          </div>
        </div>
      )
  }
}
export default ShiftsWeekDay;
