import React from 'react';
import './shifts-month.css'
import TopMenuShift from '../../topmenu/topmenu-shift';
import DayOfMonth from './day-of-month-component';
export default class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.query = ``;
    this.id = `&id=1`;
    this.datePropToUse = this.props.match.params.date ? this.props.match.params.date : this.props.defaultDate;
    this.calculateShiftHours = this.calculateShiftHours.bind(this);
    this.displayCalendarPage = this.displayCalendarPage.bind(this);
    this.groupShiftsByDate = this.groupShiftsByDate.bind(this);
    this.displayWeeklyHours = this.displayWeeklyHours.bind(this);
    this.chunkArray = this.chunkArray.bind(this);
    this.calculateSumOfHoursScheduledForWeek = this.calculateSumOfHoursScheduledForWeek.bind(this);   
    this.state = {
      scheduledHoursForCurrentMonth: []
    }
  }
 
  fetchCallMethod(query, id, methodToUse) {
    fetch(`/api/shifts-month.php` + query + id, {method: methodToUse})
      .then(res => {return res.json()})
      .then(jsonRes => {this.setState({
        scheduledHoursForCurrentMonth: jsonRes
      })})
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
  calculateShiftHours(startTime, endTime){

      let startHourDigits = Math.trunc(startTime/100)
      let startMinuteDigits = startTime/100 - Math.floor(startTime/100)
      let endHourDigits = Math.trunc(endTime/100) 
      let endMinuteDigits = endTime/100 - Math.floor(endTime/100)

      let startTimeInMinutes = startHourDigits*60 + startMinuteDigits
      let endTimeInMinutes = endHourDigits*60 + endMinuteDigits

      let shiftLengthInMinutes = endTimeInMinutes-startTimeInMinutes;


      return Math.round(shiftLengthInMinutes); 
  }
  groupShiftsByDate(shiftsArray) {
    var shifts = {};

    for(var shiftIndex=0; shiftIndex<shiftsArray.length; shiftIndex++){
      shifts[`${shiftsArray[shiftIndex].shiftDate}`] = shiftsArray[shiftIndex];
    }
    return shifts;
  }
  generateCalendarPage() {
    var selectedDate = new Date(this.datePropToUse);
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

    var monthDivArray=[]

    var calendarPage = this.generateCalendarPage();

    for(var dayOfCalendar=0; dayOfCalendar < calendarPage.length; dayOfCalendar++){
      monthDivArray.push(<DayOfMonth dayIndex={calendarPage[dayOfCalendar].getDate()}/>)
    }
    return monthDivArray
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

  displayWeeklyHours(calendarPage,shiftsArray){

    var weekTotalHoursArrayToBeDisplayed = []
    var arrayOfShiftsForWeek = []
    var bundledWeeksArray = this.chunkArray(calendarPage,7);

    var weekHourTotal=0;
    
    for(var weekIndex=0; weekIndex<bundledWeeksArray.length; weekIndex++){
      for(var dateIndex=0; dateIndex<bundledWeeksArray[weekIndex].length; dateIndex++){
        for(var shiftIndex=0 ; shiftIndex<shiftsArray.length; shiftIndex++){
          if(bundledWeeksArray[weekIndex][dateIndex].getDate() === new Date(parseInt(shiftsArray[shiftIndex].shiftDate)).getDate()){
          arrayOfShiftsForWeek.push(shiftsArray[shiftIndex]);
          weekHourTotal = this.calculateSumOfHoursScheduledForWeek(arrayOfShiftsForWeek)
        } 
        weekHourTotal = this.calculateSumOfHoursScheduledForWeek(arrayOfShiftsForWeek)
      }
    }
    arrayOfShiftsForWeek = []

    weekTotalHoursArrayToBeDisplayed.push(
              <div class = "totalHoursForWeek"> 
                <p>{weekHourTotal}</p>
              </div>
        )
    }
    return weekTotalHoursArrayToBeDisplayed
  }

  calculateSumOfHoursScheduledForWeek(arrayOfShiftsForWeek){
    if(arrayOfShiftsForWeek.length){
      let totalShiftLengthForWeek = 0;
    for(let shiftIndex=0; shiftIndex<arrayOfShiftsForWeek.length; shiftIndex++){
      let shiftToCalculate = arrayOfShiftsForWeek[shiftIndex]
      let hoursForShift = this.calculateShiftHours(shiftToCalculate.startTime, shiftToCalculate.endTime)
      totalShiftLengthForWeek += hoursForShift
    }
      let totalHours = Math.floor(totalShiftLengthForWeek/60);
      let totalMinutes = totalShiftLengthForWeek%60;
      return (totalHours + "h " + totalMinutes + "min")
    }
    return "0h 0min"
    
  }

  render() {
    //JPT - for routing had to alter date information
    if (this.props.match.params.date === undefined) {
      var dateToPass = this.props.defaultDate;
    } else {
      dateToPass = this.props.match.params.date;
      console.log(dateToPass)
    }
    return (
      <div className ="calenderContainer">
        <TopMenuShift title="MONTH" page='month' date={dateToPass}/>
        <div className="row">
                <div className="col col-lg-1">
                </div>
                <div class="col">
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
                      {this.displayCalendarPage()}
                  </div>
                </div>
                <div class="col col-lg-2">
                  <div class="weekTotal">WEEK TOTAL</div>
                  <div class="totalHoursColumn">
                    
                    {this.displayWeeklyHours(this.generateCalendarPage(),this.state.scheduledHoursForCurrentMonth)}
                  </div>
                </div>
        </div>
    </div>
    )
  }
}