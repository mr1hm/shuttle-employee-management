import React from 'react';
import './shifts-month.css'
import DayOfMonth from './day-of-week-component';
import TopMenuShift from '../../topmenu/topmenu-shift';

export default class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.getIndexFirstDayOfMonth = this.getIndexFirstDayOfMonth.bind(this);
    this.getNumberOfDaysInMonth = this.getNumberOfDaysInMonth.bind(this);
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
  componentDidMount(){
    fetch('/api/shifts-month.php', {
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
  calculateShiftHours(startTime, endTime){

      let startHourDigits = Math.trunc(startTime/100)
      let startMinuteDigits = startTime/100 - Math.floor(startTime/100)
      let endHourDigits = Math.trunc(endTime/100) 
      let endMinuteDigits = endTime/100 - Math.floor(endTime/100)

      let startTimeInMinutes = startHourDigits*60 + startMinuteDigits
      let endTimeInMinutes = endHourDigits*60 + endMinuteDigits

      let shiftLengthInMinutes = endTimeInMinutes-startTimeInMinutes;

      return shiftLengthInMinutes; 
  }
  groupShiftsByDate(shiftsArray) {
    var shifts = {};

    for(var shiftIndex=0; shiftIndex<shiftsArray.length; shiftIndex++){
      shifts[`${shiftsArray[shiftIndex].shiftDate}`] = shiftsArray[shiftIndex];
    }
    console.log("shifts:",shifts);
    return shifts;
  }
  generateCalendarPage() {
    var selectedDate = new Date(this.props.date);
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

    var displayedWeekTotalHourDiv = []
    var weekHourTotal=0;
    var sum = 0

    var calendarDates = calendarPage.map(day => day.getDate())
    var bundledWeeksArray = this.chunkArray(calendarPage,7);
    var weeklyShiftsArray = []
    console.log("bundledWeeksArray: ",bundledWeeksArray)
    for(var shiftIndex=0; shiftIndex<shiftsArray.length; shiftIndex++){ //loop through shifts
// debugger
          for(var weekIndex=0; weekIndex<bundledWeeksArray.length; weekIndex++){ //loop each week out of five in month *5
            sum = 0
            for(var dateIndex=0; dateIndex<bundledWeeksArray[weekIndex].length; dateIndex++){ //loop through each day in week in month  *7

              if(bundledWeeksArray[weekIndex][dateIndex].getDate() === new Date(parseInt(shiftsArray[shiftIndex].shiftDate)).getDate()){ //compare date value between shift and calendar
                weeklyShiftsArray.push(shiftsArray[shiftIndex]);
                
                sum += this.calculateShiftHours((shiftsArray[shiftIndex].startTime),(shiftsArray[shiftIndex].endTime))/60
                console.log("week", weekIndex+1 + ": totalHours: " + sum)
                
              } 

           }

weekHourTotal = this.calculateSumOfHoursScheduledForWeek(weeklyShiftsArray)
          displayedWeekTotalHourDiv.push(
                    <div class = "totalHoursForWeek">Total Week Hours <br></br> 
                      {/* {this.displayWeeklyHours(this.generateCalendarPage(),this.state.scheduledHoursForCurrentMonth)} */}
                      {weekHourTotal}
                    </div>
              // weekHourTotal
              )

          }
          console.log("calendarDates: ",calendarDates)
          console.log("calendarPage: ",calendarPage);
          console.log("shiftsArray:",shiftsArray)

          
    }
console.log("displayedWeekTotalHourDiv: ",displayedWeekTotalHourDiv)
    return displayedWeekTotalHourDiv
  }

  calculateSumOfHoursScheduledForWeek(arrayOfShiftsForWeek){
    let totalShiftLengthForWeek = 0;
    for(let shiftIndex=0; shiftIndex<arrayOfShiftsForWeek.length; shiftIndex++){
      let shiftToCalculate = arrayOfShiftsForWeek[shiftIndex]
      let hoursForShift = this.calculateShiftHours(shiftToCalculate.startTime, shiftToCalculate.endTime)
      totalShiftLengthForWeek += hoursForShift
    }
      let totalHours = Math.floor(totalShiftLengthForWeek/60);
      let totalMinutes = totalShiftLengthForWeek%60;
      console.log(totalHours + "h: " + totalMinutes + "min")
      return (totalHours + "h: " + totalMinutes + "min")
  }

  render() {
    return (
      <div class ="calenderContainer">
        <TopMenuShift title="MONTH"/>
        <div class="row">
                <div class="col col-lg-1">
                </div>
                <div class="col">
                  <div class="wrapper">
                      {this.displayCalendarPage()}
                  </div>
                </div>
                <div class="col col-lg-2">
                  <div class="totalHoursColumn">
                    <div class = "totalHoursForWeek">Total Week Hrs <br></br> 
                    {this.displayWeeklyHours(this.generateCalendarPage(),this.state.scheduledHoursForCurrentMonth)}
                    </div>
                  </div>
                </div>
        </div>
    </div>

    )
  }
}

