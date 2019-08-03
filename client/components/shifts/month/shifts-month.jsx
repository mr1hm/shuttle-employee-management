import React from 'react';
import WeekOfMonth from './week-of-month-component';
import TopMenuShifts from '../../topmenu/topmenu-shift';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';

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
  getMonthAndYearForCalendar(unixTimeStamp) {
    const calendarSource = {};
    let targetDay = (typeof unixTimeStamp === 'undefined') ? new Date() : new Date(unixTimeStamp);
    calendarSource.month = targetDay.getMonth();
    calendarSource.year = targetDay.getFullYear();
    return calendarSource;
  }
  getIndexFirstDayOfMonth(unixTimeStamp) {
    const monthFirstDay = new Date(this.getMonthAndYearForCalendar(unixTimeStamp).year, this.getMonthAndYearForCalendar(unixTimeStamp).month);
    return monthFirstDay.getDay();
  }
  getNumberOfDaysInMonth(unixTimeStamp) {
    const monthLastDayDate = new Date(this.getMonthAndYearForCalendar(unixTimeStamp).year, this.getMonthAndYearForCalendar(unixTimeStamp).month + 1, 0);
    return monthLastDayDate.getDate();
  }
  bundleWeeks() {
    const firstDayOfMonth = this.getIndexFirstDayOfMonth(this.props.date);
    const numberOfDaysInMonth = this.getNumberOfDaysInMonth(this.props.date);
    const weekOutput = [];
    const numOfWeeks = 5;
    let calendarDayCounter = 0;
    for (var weekIndex = 0; weekIndex < numOfWeeks; weekIndex++) {
      const currentWeekArray = [];
      for (let i = 0; i < 7; i++) {
        console.log ('inside week loop', i);
        if (i < firstDayOfMonth && calendarDayCounter === 0) {
          currentWeekArray[i] = null;
        } else {
          ++calendarDayCounter;
          //TODO: need to bundle the calendar day and the day status into the same element of the currentWeekArray
          //TODO: let dayDetails = [calendarDayCounter, _______] The ____ will come from the json file. Will hold both the day of week and status of whether the person is working. Confirm with Seong and Richard that the same approach is going to be used once the database is connected. 
          //TODO:change the LINE BELOW to assign the subarray that holds both items. currentWeekArray[i] = dayDetails;
          this.state.scheduledHoursForCurrentMonth.forEach(element => {
            console.log(element.date.slice(-2));
            if (element.date.slice(-2) === calendarDayCounter) {
              if (element.hours > 0) {
                currentWeekArray[i] = [calendarDayCounter, 'x'];
              } else {
                currentWeekArray[i] = [calendarDayCounter, ''];
              }
            }
          })

          // currentWeekArray[i] = calendarDayCounter;
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
    // if(this.state.scheduledHoursForCurrentMonth.length !== 0){
    //   return (
    //         <div>
    //           <MonthHeader/>
    //           {this.bundleWeeks()}
    //         </div>
    //       )
    // }
    return (
      <React.Fragment>
        <div>
          <TopMenuShifts title="MONTH"/>
        </div>
        <div>
          {this.bundleWeeks()}
        </div>
      </React.Fragment>
    )
  }
}

