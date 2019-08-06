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
    const dayText = convertUnixDateDay(parseInt(this.props.shifts.shiftDate));
    const dateText = convertUnixDateNumber(parseInt(this.props.shifts.shiftDate));
    const dayHours = calculateDailyWorkingHours(this.props.shifts.startTime, this.props.shifts.endTime);

    let currentDayHighlightClass = 'dayDataContainer';

    if (parseInt(this.props.defaultDay) === parseInt(this.props.shifts.shiftDate)) {
      currentDayHighlightClass += ' currentDay';
    }

    return (
      <div className={currentDayHighlightClass}>
        <div className="dayLabelContainer">
          <div className="dayText">{dayText}</div>
          <div className="dateText">{dateText}</div>
          <div className="dayHours">{dayHours} Hours</div>
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
