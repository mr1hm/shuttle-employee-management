import React from 'react';
import { Link } from 'react-router-dom';
import IndividualShift from './individual-shift';
import { convertUnixTime, convertUnixDateDay, convertUnixDateNumber, getShiftStartHour,
  getShiftStartMinute, getShiftEndHour, getShiftEndMinute, calculateDailyWorkingHours, getTotalDayWorkingHours } from '../../../lib/time-functions';


  class ShiftsWeekDay extends React.Component {
  getZeroPaddedNumber( number ){
    return ('0' + number).slice(-2);
  }
  getDateStringFromTimestamp( timestamp ){
    debugger;
    const date = new Date(parseInt(timestamp));
    return `${date.getFullYear()}-${this.getZeroPaddedNumber(date.getMonth() + 1)}-${this.getZeroPaddedNumber(date.getDate())}`
  }
  render() {
    const currentUnixDate = this.props.shifts.shiftDate;

      return (
        <React.Fragment>
        <div className="dayDataContainer">
          <div className="dayLabelContainer">
            <div className="dayText">{convertUnixDateDay(parseInt(this.props.shifts.shiftDate))}</div>
            <div className="dateText">{convertUnixDateNumber(parseInt(this.props.shifts.shiftDate))}</div>
            <div className="dayHours">{calculateDailyWorkingHours(this.props.shifts.startTime, this.props.shifts.endTime)} Hours</div>
          </div>
            <Link to={`/shifts/day/shifts-day/${this.getDateStringFromTimestamp(currentUnixDate)}`}>
            <div className="dayRowContainer">
              <div className="dayRowFill">
                <IndividualShift shiftInfo={this.props.shifts} />
              </div>
            </div>
            </Link>
        </div>
        </React.Fragment>

      )
  }
}
export default ShiftsWeekDay;
