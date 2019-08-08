import React from 'react';
import { Link } from 'react-router-dom';
import IndividualShift from './individual-shift';
import { convertUnixTime, convertUnixDateDay, convertUnixDateNumber, getShiftStartHour,
  getShiftStartMinute, getShiftEndHour, getShiftEndMinute, getTotalDayWorkingHours } from '../../../lib/time-functions';


  class ShiftsWeekDay extends React.Component {
  getZeroPaddedNumber( number ){
    return ('0' + number).slice(-2);
  }
  getDateStringFromTimestamp( timestamp ){
    const date = new Date(parseInt(timestamp));
    return `${date.getFullYear()}-${this.getZeroPaddedNumber(date.getMonth() + 1)}-${this.getZeroPaddedNumber(date.getDate())}`
  }
  calculateDailyWorkingTotalHours(startTime, endTime) {
  if (!startTime && !endTime) {
     return 0;
  }
  let startHour, startMinute, startMinutesAsRatio, startTimeFloat;
  let endHour, endMinute, endMinutesAsRatio, endTimeFloat;
  let shiftHoursPerDay;
    if (!startTime){
    return;
    } else if (startTime.startTime.length < 4 ) {
          startTime = "0" + startTime.startTime;
          parseInt(startTime);
          startHour = startTime.slice(0, 2);
          startMinute = startTime.slice(2);
          startMinutesAsRatio = parseFloat(startMinute) / 60;
          startTimeFloat = parseInt(startHour) + startMinutesAsRatio;
    } else {
          startHour = startTime.startTime.slice(0, 2);
          startMinute = startTime.startTime.slice(2);
          startMinutesAsRatio = parseFloat(startMinute) / 60;
          startTimeFloat = parseInt(startHour) + startMinutesAsRatio;
    }
    if (!endTime) {
      return;
    } else if (endTime.endTime.length < 4) {
       endTime = "0" + endTime.endTime;
       parseInt(endTime);
       endHour = endTime.slice(0, 2);
       endMinute = endTime.slice(2);
       endMinutesAsRatio = parseFloat(endMinute) / 60;
       endTimeFloat = parseInt(endHour) + endMinutesAsRatio;
       shiftHoursPerDay = endTimeFloat - startTimeFloat;
        return shiftHoursPerDay;
     } else {
       endHour = endTime.endTime.slice(0, 2);
       endMinute = endTime.endTime.slice(2);
       endMinutesAsRatio = parseFloat(endMinute) / 60;
       endTimeFloat = parseInt(endHour) + endMinutesAsRatio;
       shiftHoursPerDay = endTimeFloat - startTimeFloat;
       return shiftHoursPerDay;
      }

}
  render() {
    const dayText = convertUnixDateDay(parseInt(this.props.dayData.shiftDate));
    const dateText = convertUnixDateNumber(parseInt(this.props.dayData.shiftDate));
    const dayHours = this.calculateDailyWorkingTotalHours(this.props.dayData.shifts[0], this.props.dayData.shifts[0]);
    const currentUnixDate = this.props.dayData.shiftDate;

    let currentDayHighlightClass = 'dayDataContainer';

    if (parseInt(this.props.defaultDay) === parseInt(this.props.dayData.shiftDate)) {
      currentDayHighlightClass += ' currentDay';
    }

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
