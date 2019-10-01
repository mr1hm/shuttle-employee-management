import React from 'react';
import { Link } from 'react-router-dom';
import './shifts-month.css';
import '../../app.css';
import TopMenuShift from '../../topmenu/topmenu-shift';
import DayOfMonth from './day-of-month-component';
import Legend from './shift-month-legends'
import { 
  createDateObjFromDateString, 
  calculateShiftHours, 
  adjustLocalTimestampToUTCSeconds, 
  adjustUTCSecondsToLocalTimestamp, 
  convertUnixMonthDay 
} from '../../../lib/time-functions';
// import RouteBusDisplay from '../../route-bus-display';

class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.id = '&id=17';
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
    const secondsTimestampStartRange = adjustLocalTimestampToUTCSeconds(unixCalendarStartRange) + "";
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
    const secondsTimestampEndRange = adjustLocalTimestampToUTCSeconds(unixCalendarEndRange) + "";
    const query = `?unixstart=${secondsTimestampStartRange}&unixend=${secondsTimestampEndRange}`;
    return query;
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
        <Link
          key={calendarPage[dayOfCalendar].getTime()}
          className={calendarPage[dayOfCalendar].getFullYear() +
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
  getZeroPaddedNumber(number) {// could be moved to time-function.jsx get last two number of string exmple: input:getZeroPaddedNumber(8449897897)
    return ('0' + number).slice(-2);// Output: "97"
  }
  getDateStringFromTimestamp(timestamp) {// The convertUnixMonthDay(time) function from shifts-day.jsx could be used here 09/17/2019
    const date = new Date(parseInt(timestamp));
    return `${date.getFullYear()}-${this.getZeroPaddedNumber(date.getMonth() + 1)}-${this.getZeroPaddedNumber(date.getDate())}`
  }
  displayWeeklyHours(calendarPage,shiftsArray){
    // console.log("shiftsArray", shiftsArray);
    var weekTotalHoursArrayToBeDisplayed = [];
    var arrayOfRoundsForWeek = [];
    var bundledWeeksArray = this.chunkArray(calendarPage,7);
    var weekHourTotal=null;
    for(var weekIndex=0; weekIndex<bundledWeeksArray.length; weekIndex++){
      for(var dateIndex=0; dateIndex<bundledWeeksArray[weekIndex].length; dateIndex++){
        for(var roundIndex=0 ; roundIndex<shiftsArray.length; roundIndex++){
          const calendarTimestamp = bundledWeeksArray[weekIndex][dateIndex].getTime();
          const shiftTimestamp = parseInt(adjustUTCSecondsToLocalTimestamp(shiftsArray[roundIndex].date));
          const calendarTimestampToStringDate = convertUnixMonthDay(calendarTimestamp);
          const shiftTimestampToStringDate = convertUnixMonthDay(shiftTimestamp);
          if (calendarTimestampToStringDate === shiftTimestampToStringDate) {
            arrayOfRoundsForWeek.push(shiftsArray[roundIndex]);
            // console.log("array of rounds per week: ",arrayOfRoundsForWeek);
          }
          weekHourTotal = <div>{this.calculateSumOfHoursScheduledForWeek(arrayOfRoundsForWeek)}</div>;
        }
      }
      if (!weekHourTotal) {
        weekHourTotal = <div style={{"color" : "lightgrey"}}>No Shifts</div>;
      }
      var targetUnixDate = bundledWeeksArray[weekIndex][0].getTime();
      arrayOfRoundsForWeek = [];
      weekTotalHoursArrayToBeDisplayed.push(
        <Link key={bundledWeeksArray[weekIndex][0].getTime()}
          className="link-style"
          to={`/shifts/week/shifts-week/${this.getDateStringFromTimestamp(targetUnixDate)}`}>
          <div className = "totalHoursForWeek">
            {weekHourTotal}
          </div>
        </Link>
      )
    }
    // console.log("array of rounds per week: ",arrayOfRoundsForWeek)
    return weekTotalHoursArrayToBeDisplayed;
  }
  calculateSumOfHoursScheduledForWeek(arrayOfRoundsForWeek){
    if(arrayOfRoundsForWeek.length){
      let totalShiftLengthForWeek = 0;
      for(let roundIndex=0; roundIndex<arrayOfRoundsForWeek.length; roundIndex++){
        let roundToCalculate = arrayOfRoundsForWeek[roundIndex];
        let hoursForShift = calculateShiftHours(roundToCalculate.start_time, roundToCalculate.end_time);
        totalShiftLengthForWeek += hoursForShift;
      }
      let totalHours = Math.floor(totalShiftLengthForWeek/60);
      let totalMinutes = totalShiftLengthForWeek%60;
      return (totalHours + "h " + totalMinutes + "m");
    } else return <div style={{"color" : "lightgrey"}}>No Shifts</div>;
  }
  render() {
    if (this.props.match.params.date === undefined) {
      var dateToPass = this.props.defaultDate;
    } else {
      dateToPass = createDateObjFromDateString(this.props.match.params.date);// converts unix time to date/at midnight 09/17/2019
      dateToPass = dateToPass.getTime();
    }
    if (!this.state.scheduledHoursForCurrentMonth){
      return <div>No Shifts Available</div>;
    }
    return (
      <div className ="calenderContainer">
        <TopMenuShift title="MONTH" page='month' date={dateToPass}/>
        {/* <RouteBusDisplay bus='1' route='H'/> */}
        <div className="row" className="calendarBox">
          <div className="monthCalendar">
            <div className="dayOfMonth Title">
              <div>SUN</div>
              <div>MON</div>
              <div>TUE</div>
              <div>WED</div>
              <div>THU</div>
              <div>FRI</div>
              <div>SAT</div>
            </div>
            <div className="wrapper">
                {this.displayCalendarPage(dateToPass)}
            </div>
          </div>
          <div className="weekTotalCol">
            <div className="weekTotal">TOTAL</div>
              <div className="totalHoursColumn">
                <div className="weekTotalWrapper">
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
