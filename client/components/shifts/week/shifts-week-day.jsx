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

    const date = new Date(parseInt(timestamp));
    return `${date.getFullYear()}-${this.getZeroPaddedNumber(date.getMonth() + 1)}-${this.getZeroPaddedNumber(date.getDate())}`
  }
  render() {
    debugger;
    const dayText = convertUnixDateDay(parseInt(this.props.dayData.shiftDate));
    const dateText = convertUnixDateNumber(parseInt(this.props.dayData.shiftDate));
    const dayHours = 0//calculateDailyWorkingHours(this.props.shifts.startTime, this.props.shifts.endTime);
    const currentUnixDate = this.props.dayData.shiftDate;

    let currentDayHighlightClass = 'dayDataContainer';

    // if (parseInt(this.props.defaultDay) === parseInt(this.props.dayData.shiftDate)) {
    //   currentDayHighlightClass += ' currentDay';
    // }

    return (
      <div className={currentDayHighlightClass}>
        <div className="dayLabelContainer">
          <div className="dayText">{dayText}</div>
          <div className="dateText">{dateText}</div>
          <div className="dayHours">{dayHours} Hours</div>
        </div>
        <Link to={`/shifts/day/shifts-day/${this.getDateStringFromTimestamp(currentUnixDate)}`}>
        <div className="dayRowContainer">
          <div className="dayRowFill">
            {
                this.props.dayData.shifts.map(shiftData => <IndividualShift shiftInfo={shiftData} />)
            }
          </div>
        </div>
        </Link>
      </div>
    )
  }
}
export default ShiftsWeekDay;
