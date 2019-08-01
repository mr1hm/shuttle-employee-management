import React from 'react'
import IndividualShift from './individual-shift';
import {convertUnixTime, convertUnixDateDay, convertUnixDateNumber, getShiftStartHour,
  getShiftStartMinute, getShiftEndHour, getShiftEndMinute, calculateDailyWorkingHours} from './time-functions';
class ShiftsWeekDay extends React.Component {

  getTotalDayWorkingHours(startTime, EndTime) {
    let hourTotal = null;

    for (var numberOfShifts = 0; numberOfShifts < this.props.shifts.length; numberOfShifts++) {
      const hoursPerShift = calculateDailyWorkingHours(startTime, EndTime);
      hourTotal += hoursPerShift;
    }

    return hourTotal;
  }
  render() {
      return (
        <div className="dayDataContainer">
          <div className="dayLabelContainer">
            <div className="dayText">{convertUnixDateDay(this.props.shifts[0].date)}</div>
            <div className="dateText">{convertUnixDateNumber(this.props.shifts[0].date)}</div>
            <div className="dayHours">{this.getTotalDayWorkingHours(this.props.shifts[0].startTime, this.props.shifts[0].endTime)} Hours</div>
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
