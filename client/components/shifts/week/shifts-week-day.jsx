import React from 'react'
import IndividualShift from './individual-shift';
import {convertUnixTime, convertUnixDateDay, convertUnixDateNumber, getShiftStartHour,
  getShiftStartMinute, getShiftEndHour, getShiftEndMinute, calculateDailyWorkingHours} from './time-functions';
class ShiftsWeekDay extends React.Component {

  render() {
      return (
        <div className="dayDataContainer">
          <div className="dayLabelContainer">
            <div className="dayText">{convertUnixDateDay(this.props.shifts[0].date)}</div>
            <div className="dateText">{convertUnixDateNumber(this.props.shifts[0].date)}</div>
            <div className="dayHours">{calculateDailyWorkingHours(this.props.shifts[0].startTime, this.props.shifts[0].endTime)} Hours</div>
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
