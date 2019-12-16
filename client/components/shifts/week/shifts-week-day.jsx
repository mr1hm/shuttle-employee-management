import React from 'react';
import { Link } from 'react-router-dom';
import ShiftDisplayComponent from './shift-display-component';
import {
  getUTCYearMonthDateDay,
  getZeroPaddedNumber,
  getWorkingHours }
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
  renderShiftElements() {
    const elements = [];
    const shiftObjArr = [];
    const shifts = this.props.dayData.shifts;
    if (shifts.length === 0) {
      elements.push(
        <ShiftDisplayComponent
          key={0}
          width='100%'
          shift={{ startTime: 600, endTime: 2400, scheduled: false, posted: false }}
        />
      );
      return elements;
    }
    for (let shiftIndex = 0; shiftIndex < shifts.length; shiftIndex++) {
      if (shiftIndex === 0 && parseInt(shifts[0].start_time) > 600) {
        shiftObjArr.push({
          startTime: 600,
          endTime: parseInt(shifts[0].start_time),
          scheduled: false,
          posted: false
        });
      }
      if (shiftIndex > 0 && parseInt(shifts[shiftIndex - 1].end_time) !== parseInt(shifts[shiftIndex].start_time)) {
        shiftObjArr.push({
          startTime: parseInt(shifts[shiftIndex - 1].end_time),
          endTime: parseInt(shifts[shiftIndex].start_time),
          scheduled: false,
          posted: false
        });
      }
      shiftObjArr.push({
        startTime: parseInt(shifts[shiftIndex].start_time),
        endTime: parseInt(shifts[shiftIndex].end_time),
        scheduled: true,
        posted: shifts.posted
      });
      if (shiftIndex === shifts.length - 1 && shifts[shiftIndex].end_time < 2400) {
        shiftObjArr.push({
          startTime: parseInt(shifts[shiftIndex].end_time),
          endTime: 2400,
          scheduled: false,
          posted: false
        });
      }
    }
    shiftObjArr.map((shift, index) => {
      const width = this.calculateWidthOfShift(shift.startTime, shift.endTime, { start: 600, end: 2400 });
      elements.push(
        <ShiftDisplayComponent key={index} width={width} shift={shift}/>
      );
    });
    return elements;
  }

  calculateWidthOfShift(startTime, endTime, range) {
    const rangeHrs = getWorkingHours(range.start, range.end);
    const shiftHrs = getWorkingHours(startTime, endTime);
    const ratio = shiftHrs / rangeHrs;
    const width = ratio.toFixed(2) * 100 + '%';
    return width;
  }

  render() {
    const dayObj = getUTCYearMonthDateDay(this.props.dayData.round_date);
    const dayText = dayObj.dayNameShort;
    const dateText = dayObj.date;
    const dayHours = this.props.dayData.shifts.reduce((sum, current) => this.calculateDailyWorkingTotalHours(current, current) + sum, 0);
    const dayHoursRounded = dayHours.toFixed(1);
    let currentDayHighlightClass = 'dayMainContainer d-flex border';

    if (parseInt(this.props.defaultDay) === parseInt(this.props.dayData.round_date)) {
      currentDayHighlightClass += ' currentDay';
    }
    return (
      <Link
        className="shiftWeekIndividualDayLink"
        to={`/shifts/day/shifts-day/${dayObj.dateString}`}>
        <div className={currentDayHighlightClass}>
          <div className="dayInfoContainer d-flex flex-column align-items-center border-right">
            <div className="dayName font-weight-bold">{dayText}</div>
            <div className="dayDate">{dateText}</div>
            <div className="hoursSchedued">{`${dayHoursRounded}${dayHoursRounded === 1 ? 'hr' : 'hrs'}`}</div>
          </div>
          <div className="shiftRowContainer d-flex align-items-center w-100">
            {this.renderShiftElements()}
          </div>
        </div>
      </Link>
    );
  }
}

export default ShiftsWeekDay;
