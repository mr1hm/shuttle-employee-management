import React from 'react';
import WeekOfMonth from './week-of-month-component';

export default class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.bundleWeeks = this.bundleWeeks.bind(this);
    this.getIndexFirstDayOfMonth = this.getIndexFirstDayOfMonth.bind(this);
    this.getNumberOfDaysInMonth = this.getNumberOfDaysInMonth.bind(this);
    this.weeklyScheduledHours = [
      {
        id: 1,
        date: '2019-07-21',
        day: 'Sunday',
        hours: 0
      },
      {
        id: 2,
        date: '2019-07-22',
        day: 'Monday',
        hours: 5.75
      },
      {
        id: 3,
        date: '2019-07-23',
        day: 'Tuesday',
        hours: 5.25
      },
      {
        id: 4,
        date: '2019-07-24',
        day: 'Wednesday',
        hours: 0
      },
      {
        id: 5,
        date: '2019-07-25',
        day: 'Thursday',
        hours: 4.75
      },
      {
        id: 6,
        date: '2019-07-26',
        day: 'Friday',
        hours: 0
      },
      {
        id: 7,
        date: '2019-07-27',
        day: 'Saturday',
        hours: 0
      }
    ];
  }
  getIndexFirstDayOfMonth(year, monthIndex) {
    const today = new Date();
    let fourDigitYear = (typeof year !== 'undefined') ? year : today.getFullYear();
    let numberMonth = (typeof monthIndex !== 'undefined') ? monthIndex : today.getMonth();
    const monthFirstDay = new Date(fourDigitYear, numberMonth);
    return monthFirstDay.getDay();
  }
  getNumberOfDaysInMonth(year, month) {
    const today = new Date();
    let fourDigitYear = (typeof year !== 'undefined') ? year : today.getFullYear();
    let numberMonth = (typeof month !== 'undefined') ? month : today.getMonth() + 1;
    const monthLastDayDate = new Date(fourDigitYear, numberMonth, 0);
    return monthLastDayDate.getDate();
  }
  bundleWeeks() {
    const firstDayOfMonth = this.getIndexFirstDayOfMonth();
    const numberOfDaysInMonth = this.getNumberOfDaysInMonth();
    const weekOutput = [];
    const numOfWeeks = 5;
    let calendarDayCounter = 0;
    for (var weekIndex = 0; weekIndex < numOfWeeks; weekIndex++) {
      const currentWeekArray = [];
      for (let i = 0; i < 7; i++) {
        if (i < firstDayOfMonth && calendarDayCounter === 0) {
          currentWeekArray[i] = null;
        } else {
          ++calendarDayCounter;
          currentWeekArray[i] = calendarDayCounter;
        }
        if (calendarDayCounter === numberOfDaysInMonth) {
          calendarDayCounter = 0;
        }
      }
      weekOutput.push(
        <WeekOfMonth
          key={this.weeklyScheduledHours.id}
          weeklyHours={this.weeklyScheduledHours}
          currentWeekArray={currentWeekArray}
        />
      );
    }
    return weekOutput;
  }
  render() {
    return (
    <React.Fragment>
      {this.bundleWeeks()}
    </React.Fragment>
    );
  }
}