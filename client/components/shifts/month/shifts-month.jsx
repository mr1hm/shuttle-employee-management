import React from 'react';
import { Link } from 'react-router-dom';
import './shifts-month.css';
import '../../app.css';
import TopMenuShift from '../../topmenu/topmenu-shift';
import DayOfMonth from './day-of-month-component';
import Legend from './shift-month-legends'
import {createDateObjFromDateString} from '../../../lib/time-functions';
import RouteBusDisplay from '../../route-bus-display';

class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.id = '&id=1';
    this.state = {
      scheduledHoursForCurrentMonth: []
    }
  }
  getData(url, methodToUse) {
    fetch(url, { method: methodToUse })
      .then(response => { return response.json() })
      .then(monthShiftInfo => {
        this.setState({
          scheduledHoursForCurrentMonth: monthShiftInfo
        })
      })
      .catch(error => {throw(error)});
  }
  componentDidMount(){
    const initialQuery = this.calculateQueryRange(this.props.defaultDate);
    this.getData('/api/shifts-month.php' + initialQuery + this.id, 'GET');
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.date !== this.props.match.params.date) {
      const newQuery = this.calculateQueryRange(this.props.match.params.date)
      this.getData('/api/shifts-month.php' + newQuery + this.id, 'GET');
    }
  }
  calculateQueryRange(dateProp) {
    var selectedDate = new Date(dateProp);
    var firstDayOfMonth = new Date(selectedDate).setDate(1);
    var previousDate = new Date(firstDayOfMonth);
    while (previousDate.getDay() > 0) {
      previousDate = new Date(previousDate);
      previousDate.setDate(previousDate.getDate() - 1);
    }
    const unixCalendarStartRange = previousDate.getTime();
    var lastDayOfMonth = function(month,year) {
     return new Date(year, month, 0).getDate();
    };
    var lastDate = new Date(dateProp);
    lastDate.setDate(lastDayOfMonth(selectedDate.getMonth()+1, selectedDate.getFullYear()));
    while (lastDate.getDay() !== 6) {
      lastDate = new Date(lastDate);
      lastDate.setDate(lastDate.getDate() + 1);
    }
    const unixCalendarEndRange = lastDate.getTime();
    const query = `?unixstart=${unixCalendarStartRange}&unixend=${unixCalendarEndRange}`;
    return query;
  }
  calculateShiftHours(startTime, endTime){
    let startHourDigits = Math.trunc(startTime/100);
    let startMinuteDigits = startTime/100 - Math.floor(startTime/100);
    let endHourDigits = Math.trunc(endTime/100);
    let endMinuteDigits = endTime/100 - Math.floor(endTime/100);
    let startTimeInMinutes = startHourDigits*60 + startMinuteDigits;
    let endTimeInMinutes = endHourDigits*60 + endMinuteDigits;
    let shiftLengthInMinutes = endTimeInMinutes-startTimeInMinutes;
    return Math.round(shiftLengthInMinutes); 
  }
  generateCalendarPage(dateProp) {
    var selectedDate = new Date(dateProp);
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
    return calendarPage;
  }
  displayCalendarPage(dateProp) {
    var monthDivArray=[];
    var calendarPage = this.generateCalendarPage(dateProp);
    for(var dayOfCalendar=0; dayOfCalendar < calendarPage.length; dayOfCalendar++){
      var targetUnixDate = calendarPage[dayOfCalendar].getTime();
      monthDivArray.push(
        <Link className={calendarPage[dayOfCalendar].getFullYear() + 
          "-" + calendarPage[dayOfCalendar].getMonth() + 
          "-" + calendarPage[dayOfCalendar].getDate() === new Date(this.props.defaultDate).getFullYear() +
          "-" + new Date(this.props.defaultDate).getMonth() + 
          "-" + new Date(this.props.defaultDate).getDate() ? "today-mark link-style " : "link-style"} 
          to={`/shifts/day/shifts-day/${this.getDateStringFromTimestamp(targetUnixDate)}`}>
          <DayOfMonth 
            key={calendarPage[dayOfCalendar].getTime()} 
            dayObj={ calendarPage[dayOfCalendar]}
            dayIndex={calendarPage[dayOfCalendar].getDate()} 
            shiftsArray={this.state.scheduledHoursForCurrentMonth}
          />
        </Link>
      );
    }
    return monthDivArray;
  }
  chunkArray(calendarArray, chunkSize){
    var calenderIndex = 0;
    var calendarArrayLength = calendarArray.length;
    var bundledWeeksArray = [];
    for (calenderIndex = 0; calenderIndex < calendarArrayLength; calenderIndex += chunkSize) {
        var weekChunk = calendarArray.slice(calenderIndex, calenderIndex+chunkSize);
        bundledWeeksArray.push(weekChunk);
    }
    return bundledWeeksArray;
  }
  getZeroPaddedNumber( number ){
    return ('0' + number).slice(-2);
  }
  getDateStringFromTimestamp( timestamp ){
    const date = new Date(parseInt(timestamp));
    return `${date.getFullYear()}-${this.getZeroPaddedNumber(date.getMonth() + 1)}-${this.getZeroPaddedNumber(date.getDate())}`
  }
  displayWeeklyHours(calendarPage,shiftsArray){
    var weekTotalHoursArrayToBeDisplayed = [];
    var arrayOfShiftsForWeek = [];
    var bundledWeeksArray = this.chunkArray(calendarPage,7);
    var weekHourTotal=0;
    for(var weekIndex=0; weekIndex<bundledWeeksArray.length; weekIndex++){
      for(var dateIndex=0; dateIndex<bundledWeeksArray[weekIndex].length; dateIndex++){
        for(var shiftIndex=0 ; shiftIndex<shiftsArray.length; shiftIndex++){
          if(bundledWeeksArray[weekIndex][dateIndex].getTime() === new Date(parseInt(shiftsArray[shiftIndex].shiftDate)).getTime()){
            arrayOfShiftsForWeek.push(shiftsArray[shiftIndex]);
            weekHourTotal = this.calculateSumOfHoursScheduledForWeek(arrayOfShiftsForWeek);
          } 
          weekHourTotal = this.calculateSumOfHoursScheduledForWeek(arrayOfShiftsForWeek);
        }
      }
      var targetUnixDate = bundledWeeksArray[weekIndex][0].getTime();
      arrayOfShiftsForWeek = [];
      weekTotalHoursArrayToBeDisplayed.push(
        <Link key={bundledWeeksArray[weekIndex][0].getTime()} 
          className="link-style" 
          to={`/shifts/week/shifts-week/${this.getDateStringFromTimestamp(targetUnixDate)}`}>
          <div class = "totalHoursForWeek">
            <div>{weekHourTotal}</div>
          </div>
        </Link>
      )
    }
    return weekTotalHoursArrayToBeDisplayed;
  }
  calculateSumOfHoursScheduledForWeek(arrayOfShiftsForWeek){
    if(arrayOfShiftsForWeek.length){
      let totalShiftLengthForWeek = 0;
    for(let shiftIndex=0; shiftIndex<arrayOfShiftsForWeek.length; shiftIndex++){
      let shiftToCalculate = arrayOfShiftsForWeek[shiftIndex];
      let hoursForShift = this.calculateShiftHours(shiftToCalculate.startTime, shiftToCalculate.endTime);
      totalShiftLengthForWeek += hoursForShift;
    }
      let totalHours = Math.floor(totalShiftLengthForWeek/60);
      let totalMinutes = totalShiftLengthForWeek%60;
      return (totalHours + "h " + totalMinutes + "m");
    }
    return <div style={{"color" : "lightgrey"} }>No Shifts</div>;
  }
  render() {
    if (this.props.match.params.date === undefined) {
      var dateToPass = this.props.defaultDate;
    } else {
      dateToPass = createDateObjFromDateString( this.props.match.params.date );
      dateToPass = dateToPass.getTime();
    }
    if (!this.state.scheduledHoursForCurrentMonth){
      return <div>No Shifts Available</div>;
    }
    return (
      <div className ="calenderContainer">
        <TopMenuShift title="MONTH" page='month' date={dateToPass}/>
        {/* line 219 is for testing only. CSS styling is not complete */}
        <RouteBusDisplay bus='1' route='H'/> 
        <div className="row" class="calendarBox">
          <div class="monthCalendar">
            <div class="dayOfMonth Title">
              <div>SUN</div>
              <div>MON</div>
              <div>TUE</div>
              <div>WED</div>
              <div>THU</div>
              <div>FRI</div>
              <div>SAT</div>
            </div>
            <div class="wrapper">
                {this.displayCalendarPage(dateToPass)}
            </div>
          </div>
          <div class="weekTotalCol">
            <div class="weekTotal">TOTAL</div>
              <div class="totalHoursColumn">
                <div class="weekTotalWrapper">
                  {this.displayWeeklyHours(this.generateCalendarPage(dateToPass),this.state.scheduledHoursForCurrentMonth)}
                </div>
              </div>
            </div>
          </div>
          <div><Legend/></div>
      </div>
    )
  }
}

export default ShiftsMonth;