import React from 'react';
import WeekOfMonth from './week-of-month-component';
import MonthHeader from './month-header';

export default class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.bundleWeeks = this.bundleWeeks.bind(this);
    this.getIndexFirstDayOfMonth = this.getIndexFirstDayOfMonth.bind(this);
    this.getNumberOfDaysInMonth = this.getNumberOfDaysInMonth.bind(this);
    this.state = {
      scheduledHoursForCurrentMonth: []
    }
  }
  componentDidMount(){
    fetch('/api/dummy-data/dummy-data-shifts-month.json', {
      method: 'GET'
    })
      .then(res => {
        return res.json()
      })
      .then(jsonRes => {
        this.setState({
          scheduledHoursForCurrentMonth: jsonRes
        })
      });
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
          key={this.state.scheduledHoursForCurrentMonth.id}
          weeklyHours={this.state.scheduledHoursForCurrentMonth}
          currentWeekArray={currentWeekArray}
        />
      );
    }
    return weekOutput;
  }
  render() {
    if(this.state.scheduledHoursForCurrentMonth.length !== 0){
      return (
            <div>
              <MonthHeader/>
              {this.bundleWeeks()}
            </div>
          )
    }
    return (
      <div>
        <MonthHeader/>
        {this.bundleWeeks()}
      </div>
    )
  }
}

