import React from 'react';
import './shifts-month.css'
import WeekOfMonth from './week-of-month-component';
import TopMenuShift from '../../topmenu/topmenu-shift';

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
    fetch('/api/shifts-month.php', {
      method: 'GET'
    })
      .then(res => {
        return res.json()
      })
      .then(jsonRes => {
        console.log("db-datapoints: ", jsonRes)
        console.log("hoursInShift: ", (jsonRes[0].endTime-jsonRes[0].startTime)/100 + " hours on the", (new Date(1563704640000)).getDate() )
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
    return (
      <div>
        <TopMenuShift title="MONTH"/>
        <div class="wrapper">
        {this.bundleWeeks()}
        </div>
        
      </div>
    )
  }
}

