import React from 'react';
import TopMenuShift from '../../topmenu/topmenu-shift';

export default class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.generateCalendarPage = this.generateCalendarPage.bind(this);
    this.query = "";
    this.state = {
      scheduledHoursForCurrentMonth: []
    }
  }
  fetchCallMethod(query, methodToUse) {
    fetch('/api/shifts-month.php?' + query, {method: methodToUse})
      .then(res => {return res.json()})
      .then(jsonRes => {this.setState({
        scheduledHoursForCurrentMonth: jsonRes
      })})
  }
  componentDidMount(){
    this.fetchCallMethod('/api/shifts-month.php', 'GET');
  }
  generateCalendarPage(unixTimeStamp) {
    var today = new Date(unixTimeStamp);
    var firstDayOfMonth = new Date(today);
    firstDayOfMonth.setDate(1);
  
    var calendarPage = [firstDayOfMonth];
    var previousDate = firstDayOfMonth;
    while (previousDate.getDay() > 0) {
      previousDate = new Date(previousDate);
      previousDate.setDate(previousDate.getDate() - 1);
      calendarPage.unshift(previousDate);
    }
    var nextDayOfMonth = new Date(firstDayOfMonth);
    nextDayOfMonth.setDate(nextDayOfMonth.getDate() + 1);
  
    while (nextDayOfMonth.getMonth() === firstDayOfMonth.getMonth()) {
      calendarPage.push(nextDayOfMonth);
      nextDayOfMonth = new Date(nextDayOfMonth);
      nextDayOfMonth.setDate(nextDayOfMonth.getDate() + 1);
      console.log("Next day of month", nextDayOfMonth.toDateString());
    }
  
    var dayOfNextMonth = new Date(nextDayOfMonth);
  
    while (dayOfNextMonth.getDay() !== 0) {
      calendarPage.push(dayOfNextMonth);
      dayOfNextMonth = new Date(dayOfNextMonth);
      dayOfNextMonth.setDate(dayOfNextMonth.getDate() + 1);
    }
    
    const unixCalendarStartRange = new Date(calendarPage[0].toDateString()).getTime();
    const unixCalendarEndRange = new Date(calendarPage[calendarPage.length - 1].toDateString()).getTime();
    this.query = ``
    return calendarPage;
  }
  render() {
    return (
      <div>
        <TopMenuShift title="MONTH"/>
        {this.generateCalendarPage()}
      </div>
    )
  }
}

