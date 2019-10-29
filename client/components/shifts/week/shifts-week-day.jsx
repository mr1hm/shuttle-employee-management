import React from 'react';
import { Link } from 'react-router-dom';
// import IndividualShift from './individual-shift';
import ShiftDisplayComponent from './shift-display-component';
import { convertMilitaryTimeStringToMilitaryTimeFloat, convertUnixDateDay, convertUnixDateNumber } from '../../../lib/time-functions';

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
    } else if (startTime.start_time.length < 4 ) {
          startTime = "0" + startTime.start_time;
          parseInt(startTime);
          startHour = startTime.slice(0, 2);
          startMinute = startTime.slice(2);
          startMinutesAsRatio = parseFloat(startMinute) / 60;
          startTimeFloat = parseInt(startHour) + startMinutesAsRatio;
    } else {
          startHour = startTime.start_time.slice(0, 2);
          startMinute = startTime.start_time.slice(2);
          startMinutesAsRatio = parseFloat(startMinute) / 60;
          startTimeFloat = parseInt(startHour) + startMinutesAsRatio;
    }
    if (!endTime) {
      return;
    } else if (endTime.end_time.length < 4) {
       endTime = "0" + endTime.end_time;
       parseInt(endTime);
       endHour = endTime.slice(0, 2);
       endMinute = endTime.slice(2);
       endMinutesAsRatio = parseFloat(endMinute) / 60;
       endTimeFloat = parseInt(endHour) + endMinutesAsRatio;
       shiftHoursPerDay = endTimeFloat - startTimeFloat;
        return shiftHoursPerDay;
     } else {
       endHour = endTime.end_time.slice(0, 2);
       endMinute = endTime.end_time.slice(2);
       endMinutesAsRatio = parseFloat(endMinute) / 60;
       endTimeFloat = parseInt(endHour) + endMinutesAsRatio;
       shiftHoursPerDay = endTimeFloat - startTimeFloat;
       return shiftHoursPerDay;
      }
  }
  render() {
    // console.log('day data: ', this.props.dayData); 
    // console.log('shift data: ', this.props.shifts);

    const range = { min: 6, max: 24 };
    const startAndEndTimes = {start: 6, end: 24};
    const dayText = convertUnixDateDay(parseInt(this.props.dayData.round_date));
    const dateText = convertUnixDateNumber(parseInt(this.props.dayData.round_date));
    const dayHours = this.props.dayData.shifts.reduce(((sum, current) => this.calculateDailyWorkingTotalHours(current, current)+sum),0);
    const currentUnixDate = this.props.dayData.round_date;
    let currentDayHighlightClass = 'dayDataContainer';

    if (parseInt(this.props.defaultDay) === parseInt(this.props.dayData.round_date)) {
      currentDayHighlightClass += ' currentDay';
    }
    const convertedShifts = this.props.shifts.map( (data,index) => ({
      test: data.test + '-' + index,
      type: data.posted ? 'posted': 'scheduled',
      range: {
        min: range.min,
        max: range.max
      },
      shiftData: { 
        start: convertMilitaryTimeStringToMilitaryTimeFloat(data.start_time),
        end: convertMilitaryTimeStringToMilitaryTimeFloat(data.end_time)
      },
      children: [data]
    }));
    return (
      <div className={currentDayHighlightClass}>
        <div className="dayLabelContainer">
          <div className="dayText">{dayText}</div>
          <div className="dateText">{dateText}</div>
          <div className="dayHours">{dayHours} {dayHours === 1 ? 'Hour' : 'Hours'}</div>
        </div>
        <Link to={`/shifts/day/shifts-day/${this.getDateStringFromTimestamp(currentUnixDate)}`}>
        <div className="shiftRowContainer">
            <ShiftDisplayComponent 
              test='1'
              type='active'
              range={range}
              shiftData={startAndEndTimes}
              children={convertedShifts}
            />
        </div>
        </Link>
      </div>
    )
  }
}

export default ShiftsWeekDay;


/*
inside
children: []
range: {min: 6, max: 24}
shiftData: {start: 8, end: 11.5}
test: "undefined-0"
type: "posted"
__proto__: Object

outside
children: []
range: {min: 600, max: 2400}
shiftData: {start: 600, end: 2400}
test: "1"
type: "active"
__proto__: Object
*/