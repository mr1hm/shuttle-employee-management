import React from 'react';
import { Link } from 'react-router-dom';
import ShiftDisplayComponent from './shift-display-component';
import {
  getUTCYearMonthDateDay,
  convertMilitaryTimeStringToMilitaryTimeFloat,
  getZeroPaddedNumber,
  convertUnixDateDay,
  convertUnixDateNumber }
  from '../../../lib/time-functions';

class ShiftsWeekDay extends React.Component {
  getDateStringFromTimestamp(timestamp) { // The convertUnixMonthDay(time) function from shifts-day.jsx could be used here 09/17/2019
    const date = new Date(parseInt(timestamp));
    return `${date.getUTCFullYear()}-${getZeroPaddedNumber(date.getUTCMonth() + 1)}-${getZeroPaddedNumber(date.getUTCDate())}`;
  }
  calculateDailyWorkingTotalHours(startTime, endTime) {
    if (!startTime && !endTime) {
      return 0;
    }
    let startHour, startMinute, startMinutesAsRatio, startTimeFloat;
    let endHour, endMinute, endMinutesAsRatio, endTimeFloat;
    let shiftHoursPerDay;
    if (!startTime) {
      return;
    } else if (startTime.start_time.length < 4) {
      startTime = '0' + startTime.start_time;
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
    // eslint-disable-next-line no-empty
    if (!endTime) {

    } else if (endTime.end_time.length < 4) {
      endTime = '0' + endTime.end_time;
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
    const range = { min: 6, max: 24 };
    const startAndEndTimes = { start: 6, end: 24 };
    const dayObj = getUTCYearMonthDateDay(this.props.dayData.round_date);
    // console.log('dayObj: ', dayObj);
    const dayText = dayObj.dayNameShort;
    const dateText = dayObj.date;
    const dayHours = this.props.dayData.shifts.reduce((sum, current) => this.calculateDailyWorkingTotalHours(current, current) + sum, 0);
    const dayHoursRounded = dayHours.toFixed(1);
    const currentUnixDate = this.props.dayData.round_date;
    let currentDayHighlightClass = 'dayMainContainer d-flex border';

    if (parseInt(this.props.defaultDay) === parseInt(this.props.dayData.round_date)) {
      currentDayHighlightClass += ' currentDay';
    }
    const convertedShifts = this.props.shifts.map((data, index) => ({
      test: data.test + '-' + index,
      type: data.posted ? 'posted' : 'scheduled',
      range: {
        min: range.min,
        max: range.max
      },
      shiftData: {
        start: convertMilitaryTimeStringToMilitaryTimeFloat(data.start_time), // not working Uncaught TypeError: startTime.slice is not a function
        end: convertMilitaryTimeStringToMilitaryTimeFloat(data.end_time)// not working Uncaught TypeError: startTime.slice is not a function
      },
      children: [data]
    }));
    console.log('convertedShifts: ', convertedShifts);
    return (
      <Link
        className="shiftWeekIndividualDayLink"
        to={`/shifts/day/shifts-day/${dayObj.dateString}`}>
        <div className={currentDayHighlightClass}>
          <div className="dayInfoContainer d-flex flex-column align-items-center border-right p-2">
            <div className="dayName font-weight-bold">{dayText}</div>
            <div className="dayDate">{dateText}</div>
            <div className="hoursSchedued">{`${dayHoursRounded}${dayHoursRounded === 1 ? 'hr' : 'hrs'}`}</div>
          </div>
          <div className="shiftRowContainer w-100">
            <ShiftDisplayComponent
              test='1'
              type='active'
              range={range}
              shiftData={startAndEndTimes}
              children={convertedShifts}
            />
          </div>
        </div>
      </Link>
    );
  }
}

export default ShiftsWeekDay;
