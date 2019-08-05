import React from 'react';
import './shifts-month.css'
import DayOfMonth from './day-of-week-component';
import TopMenuShift from '../../topmenu/topmenu-shift';

export default class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.bundleDays = this.bundleDays.bind(this);
    this.getIndexFirstDayOfMonth = this.getIndexFirstDayOfMonth.bind(this);
    this.getNumberOfDaysInMonth = this.getNumberOfDaysInMonth.bind(this);
    this.calculateSumOfHoursScheduledForWeek = this.calculateSumOfHoursScheduledForWeek.bind(this); 
    this.calculateShiftHours = this.calculateShiftHours.bind(this)
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
  sumHoursOfWeek(){

  }
  getDayOfWeek(unixTimeStamp){
    const dateInUnix = new Date(unixTimeStamp);
    console.log(dateInUnix.getDay())
    return dateInUnix.getDay()
  }

  calculateShiftHours(startTime, endTime){

      let startHourDigits = Math.trunc(startTime/100) //6
      let startMinuteDigits = startTime/100 - Math.floor(startTime/100)//00
      let endHourDigits = Math.trunc(endTime/100) //11
      let endMinuteDigits = endTime/100 - Math.floor(endTime/100)//00

      let startTimeInMinutes = startHourDigits*60 + startMinuteDigits
      let endTimeInMinutes = endHourDigits*60 + endMinuteDigits

      let shiftLengthInMinutes = endTimeInMinutes-startTimeInMinutes;

      return shiftLengthInMinutes; 
  }

  calculateSumOfHoursScheduledForWeek(arrayOfShiftsForWeek){

    let totalShiftLengthForWeek = 0;
    //takes in an array of shifts for one week as an argument = [{startTime: "600", endTime: "1100", shiftDate: "1563704640000"},{startTime: "1330", endTime: "1630", shiftDate: "1563951600000"}]
    //let totalHoursForWeek = 0; //initial hours total for week         Math.ceil(6.45) = 7.00    minutes =  60-(startTime.-Math.floor(startTime/100)*100) +  endTime-Math.floor(endTime/100)*100      hours =  Math.floor(endTime/100) - Math.ceil(startTime/100) = 4  -startTime  60 - 45 min,    ,4 hours 15min
    for(let shiftIndex=0; shiftIndex<arrayOfShiftsForWeek.length; shiftIndex++){ //loop through each shift in week
      let shiftToCalculate = arrayOfShiftsForWeek[shiftIndex]
      let hoursForShift = this.calculateShiftHours(shiftToCalculate.startTime, shiftToCalculate.endTime)
      totalShiftLengthForWeek += hoursForShift
    }
      let totalHours = Math.floor(totalShiftLengthForWeek/60)
      let totalMinutes = totalShiftLengthForWeek%60

      console.log(totalHours + "h: " + totalMinutes + "min")
      return (totalHours + "h: " + totalMinutes + "min")
  }

  displayWeeklyHours(shiftsInMonthArray){
      //loop through shift array and look for unix time for  week. 
      let weekArray = []
      for(var shiftIndex=0; shiftIndex<shiftsInMonthArray.length; shiftIndex++){ //any shift in month
        var unixOfShift = shiftsInMonthArray[shiftIndex].shiftDate
        console.log("unixOfShift: ",unixOfShift)
        // let unixConverted = new Date(unixOfShift) // convert unix of each shift in month
        var unixConverted = new Date(1563704640000)
        console.log("unixConverted: ",unixConverted.getDay())

       
        // let totalHours = this.calculateSumOfHoursScheduledForWeek(weekArray)
        // console.log("totalHours: ", totalHours)
        // return totalHours;
      }
  }
  bundleDays() {
    const firstDayOfMonth = this.getIndexFirstDayOfMonth(this.props.date);
    const numberOfDaysInMonth = this.getNumberOfDaysInMonth(this.props.date);

    var monthDivArray=[]
    for(var numberOfDaysOfPrevMonth=0; numberOfDaysOfPrevMonth < new Date(this.props.date).getDay()-1; numberOfDaysOfPrevMonth++){
            monthDivArray.push(<div>{30+numberOfDaysOfPrevMonth}</div>)
          }

    for(var i = firstDayOfMonth; i<=numberOfDaysInMonth; i++){
      monthDivArray.push(<DayOfMonth dayIndex={i}/>)
    }
    
    console.log("number of days carried over from prev month: ",new Date(this.props.date).getDay())
    return monthDivArray
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
                      {this.bundleDays()}
                  </div>
                </div>
                <div class="col col-lg-2">
                  <div class="totalHoursColumn">
                    <div class = "totalHoursForWeek">Total Hours for Week
                    {this.displayWeeklyHours(this.state.scheduledHoursForCurrentMonth)}
                    </div>
                  </div>
                </div>
        </div>
    </div>

    )
  }
}

