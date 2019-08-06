import React from 'react';
import TopMenuShift from '../../topmenu/topmenu-shift';
import DayOfMonth from './day-of-month-component';
export default class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.generateCalendarPage = this.generateCalendarPage.bind(this);
    this.displayCalendarPage = this.displayCalendarPage.bind(this);
    this.query = ``;
    this.id = `&id=1`;
    this.state = {
      scheduledHoursForCurrentMonth: []
    }
  }
  fetchCallMethod(query, id, methodToUse) {
    fetch(`/api/shifts-month.php` + query + id, {method: methodToUse})
      .then(res => {return res.json()})
      .then(jsonRes => {this.setState({
        scheduledHoursForCurrentMonth: jsonRes
      }), console.log("state:", this.state)})
      .catch(error => {throw(error)})
  }
  componentDidMount(){
    this.fetchCallMethod(this.query, this.id, 'GET');
  }
  generateCalendarPage(unixTimeStamp) {
    var selectedDate = new Date(unixTimeStamp);
    var firstDayOfMonth = new Date(selectedDate);
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
    }
  
    var dayOfNextMonth = new Date(nextDayOfMonth);
  
    while (dayOfNextMonth.getDay() !== 0) {
      calendarPage.push(dayOfNextMonth);
      dayOfNextMonth = new Date(dayOfNextMonth);
      dayOfNextMonth.setDate(dayOfNextMonth.getDate() + 1);
    }
    const unixCalendarStartRange = new Date(calendarPage[0].toDateString()).getTime();
    const unixCalendarEndRange = new Date(calendarPage[calendarPage.length - 1].toDateString()).getTime();
    this.query = `?unixstart=${unixCalendarStartRange}&unixend=${unixCalendarEndRange}`;
    return calendarPage;
  }
  displayCalendarPage() {
    var monthDivArray=[];
    var calendarPage = this.generateCalendarPage(this.props.match.params.date);
    for(var dayOfCalendar=0; dayOfCalendar < calendarPage.length; dayOfCalendar++){
      monthDivArray.push(<DayOfMonth dayIndex={calendarPage[dayOfCalendar].getDate()}/>)
    }
    return monthDivArray
  }
  render() {
    if (this.props.match.params.date === undefined) {
      this.props.match.params.date = this.props.defaultDate;
    }
    return (
      <div>
        <TopMenuShift title="MONTH" page='month' date={this.props.match.params.date}/>
        {this.displayCalendarPage()}
      </div>
    )
  }
}