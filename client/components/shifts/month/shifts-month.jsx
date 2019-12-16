import React from 'react';
import { Link } from 'react-router-dom';
import './shifts-month.css';
import '../../app.css';
import TopMenuShift from '../../topmenu/topmenu-shift';
import DayOfMonth from './day-of-month-component';
import Legend from './shift-month-legends';
import {
  getLocalDateString,
  getDateString,
  getWorkingHours
} from '../../../lib/time-functions';

class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      today: new Date(),
      date: new Date(this.props.match.params.date),
      calendar: [],
      weeklyHrs: [],
      shiftsForEachDay: {},
      scheduledHoursForCurrentMonth: [],
      swapFlag: 0
    };
  }

  getMonthInfo() {
    const dateObj = new Date(this.props.match.params.date);
    const year = dateObj.getUTCFullYear();
    const month = dateObj.getUTCMonth();
    const numOfDaysInMonth = new Date(year, month + 1, 0).getUTCDate();
    const firstDayOfMonth = new Date(year, month, 1).getUTCDay();
    return { numOfDaysInMonth: numOfDaysInMonth, firstDayOfMonth: firstDayOfMonth };
  }

  renderCalendar() {
    const todayString = getLocalDateString(this.state.today);
    const monthInfo = this.getMonthInfo();
    const dayOffset = monthInfo.firstDayOfMonth;
    const numOfDaysInMonth = monthInfo.numOfDaysInMonth;
    const weeklyHrs = [];
    const monthElements = [];
    for (let monthDayIndex = 1 - dayOffset; monthDayIndex <= numOfDaysInMonth;) {
      const weekElement = [];
      let currentWeek = { date: null, hrs: 0 };
      for (let weekDayIndex = 0; weekDayIndex < 7; weekDayIndex++, monthDayIndex++) {
        const newDate = new Date(this.props.match.params.date);
        newDate.setUTCDate(monthDayIndex);
        const currentString = getDateString(newDate);
        if (weekDayIndex === 0) {
          currentWeek.date = currentString;
        }
        let classString = monthDayIndex < 1 || monthDayIndex > numOfDaysInMonth ? 'text-secondary' : '';
        classString += currentString === todayString ? ' today-mark link-style ' : ' link-style';
        currentWeek.hrs += this.getDailyHrs(currentString);
        weekElement.push(
          <td key={monthDayIndex} className="align-middle p-0">
            <Link
              className={classString}
              to={{
                pathname: `/shifts/day/shifts-day/${currentString}`,
                state: { swapFlag: this.state.swapFlag }
              }}>
              <DayOfMonth
                dayObj={new Date(currentString)}
                dayIndex={monthDayIndex > 0 && monthDayIndex <= numOfDaysInMonth ? monthDayIndex : newDate.getUTCDate()}
                shiftsArray={this.state.scheduledHoursForCurrentMonth} />
            </Link>
          </td>
        );
      }
      weeklyHrs.push(currentWeek);
      monthElements.push(
        <tr key={monthDayIndex} >
          {weekElement}
        </tr>
      );
    }
    this.setState({
      weeklyHrs: weeklyHrs,
      calendar: monthElements
    });
  }

  getDailyHrs(dateString) {
    let hours = 0;
    const shifts = this.state.scheduledHoursForCurrentMonth;
    shifts.map(shift => {
      if (shift.date === dateString) {
        hours += parseFloat(getWorkingHours(shift.start_time, shift.end_time));
      }
    });
    return hours;
  }

  displayWeeklyHours() {
    const elements = [];
    const weeklyHrs = this.state.weeklyHrs;
    weeklyHrs.map((week, index) => {
      elements.push(
        <tr key={index}>
          <td className="align-middle p-0">
            <Link
              className="link-style"
              to={`/shifts/week/shifts-week/${week.date}`}>
              <div className="weekHours d-flex justify-content-center align-items-center">
                {week.hrs ? week.hrs : 'no shifts'}
              </div>
            </Link>
          </td>
        </tr>
      );
    });
    return elements;
  }

  componentDidMount() {
    const swapFlag = this.props.location.state ? this.props.location.state.swapFlag : 0;
    const initialQuery = this.calculateQueryRange(this.props.match.params.date);
    this.getData('/api/shifts-month.php' + initialQuery, 'GET');
    this.setState({
      swapFlag: swapFlag
    });
  }

  calculateQueryRange(dateString) {
    const currentDate = new Date(dateString);
    const firstDayOfMonth = new Date(dateString);
    firstDayOfMonth.setUTCDate(1);
    let dayOffset = firstDayOfMonth.getUTCDay();
    firstDayOfMonth.setUTCDate(1 - dayOffset);
    const firstDateString = getDateString(firstDayOfMonth);
    const getLastDayOfMonth = function (month, year) {
      return new Date(year, month, 0).getUTCDate();
    };
    const lastDayOfMonth = new Date(dateString);
    const lastDate = getLastDayOfMonth(currentDate.getUTCMonth() + 1, currentDate.getUTCFullYear());
    lastDayOfMonth.setUTCDate(lastDate);
    dayOffset = lastDayOfMonth.getUTCDay();
    lastDayOfMonth.setUTCDate(lastDate + 6 - dayOffset);

    const lastDateString = getDateString(lastDayOfMonth);
    const query = `?startDate=${firstDateString}&endDate=${lastDateString}`;
    return query;
  }

  getData(url, methodToUse) {
    fetch(url, { method: methodToUse })
      .then(response => response.json())
      .then(monthShiftInfo => {
        this.setState({
          scheduledHoursForCurrentMonth: monthShiftInfo
        });
        this.renderCalendar();
      })
      .catch(error => { throw (error); });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.date !== this.props.match.params.date) {
<<<<<<< HEAD
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
    var arrayOfRoundsForWeek = [];
    var bundledWeeksArray = this.chunkArray(calendarPage,7);
    var weekHourTotal=0;
    for(var weekIndex=0; weekIndex<bundledWeeksArray.length; weekIndex++){
      for(var dateIndex=0; dateIndex<bundledWeeksArray[weekIndex].length; dateIndex++){
        for(var roundIndex=0 ; roundIndex<shiftsArray.length; roundIndex++){
          if(bundledWeeksArray[weekIndex][dateIndex].getTime() === new Date(parseInt(shiftsArray[roundIndex].round_date)).getTime()){
            arrayOfRoundsForWeek.push(shiftsArray[roundIndex]);
            console.log("array of rounds per week: ",arrayOfRoundsForWeek)
            weekHourTotal = this.calculateSumOfHoursScheduledForWeek(arrayOfRoundsForWeek);
          }
          weekHourTotal = this.calculateSumOfHoursScheduledForWeek(arrayOfRoundsForWeek);
        }
      }
      var targetUnixDate = bundledWeeksArray[weekIndex][0].getTime();
      arrayOfRoundsForWeek = [];
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
    console.log("array of rounds per week: ",arrayOfRoundsForWeek)
    return weekTotalHoursArrayToBeDisplayed;
  }
  calculateSumOfHoursScheduledForWeek(arrayOfRoundsForWeek){
    if(arrayOfRoundsForWeek.length){
      let totalShiftLengthForWeek = 0;
    for(let roundIndex=0; roundIndex<arrayOfRoundsForWeek.length; roundIndex++){
      let roundToCalculate = arrayOfRoundsForWeek[roundIndex];
      let hoursForShift = this.calculateShiftHours(roundToCalculate.start_time, roundToCalculate.end_time);
      totalShiftLengthForWeek += hoursForShift;
    }
      let totalHours = Math.floor(totalShiftLengthForWeek/60);
      let totalMinutes = totalShiftLengthForWeek%60;
      return (totalHours + "h " + totalMinutes + "m");
    }
    return <div style={{"color" : "lightgrey"} }>No Shifts</div>;
=======
      const newQuery = this.calculateQueryRange(this.props.match.params.date);
      this.getData('/api/shifts-month.php' + newQuery, 'GET');
    }
>>>>>>> 2104ba19b95d2356742687f48d902a6831e8d25d
  }

  render() {
    if (this.props.match.params.date === undefined) {
      var dateToPass = this.props.defaultDate;
    } else {
<<<<<<< HEAD
      dateToPass = createDateObjFromDateString( this.props.match.params.date );
=======
      dateToPass = new Date(this.props.match.params.date);// converts unix time to date/at midnight 09/17/2019
>>>>>>> 2104ba19b95d2356742687f48d902a6831e8d25d
      dateToPass = dateToPass.getTime();
    }
    if (!this.state.scheduledHoursForCurrentMonth) {
      return <div>No Shifts Available</div>;
    }
    return (
<<<<<<< HEAD
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
=======
      <div className="mainCalendarContainer">
        <TopMenuShift userId={this.props.userId} title="MONTH" page='month' date={dateToPass} dateString={this.props.match.params.date} />
        <div className="calendarShiftContainer mx-4">
          <div className="calendarContainer d-flex h-100">
            <table className="monthTable table h-100 m-0 border-bottom">
              <thead>
                <tr className="monthDays">
                  <th className="p-0" scope="col">SUN</th>
                  <th className="p-0" scope="col">MON</th>
                  <th className="p-0" scope="col">TUE</th>
                  <th className="p-0" scope="col">WED</th>
                  <th className="p-0" scope="col">THU</th>
                  <th className="p-0" scope="col">FRI</th>
                  <th className="p-0" scope="col">SAT</th>
                </tr>
              </thead>
              <tbody className="monthDates">
                {this.state.calendar}
              </tbody>
            </table>
            <table className="weekTotal table h-100 m-0 border-bottom">
              <thead>
                <tr>
                  <th className="p-0" >TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {this.displayWeeklyHours()}
              </tbody>
            </table>
>>>>>>> 2104ba19b95d2356742687f48d902a6831e8d25d
          </div>
        </div>
        <div><Legend /></div>
      </div>
    );
  }
}

export default ShiftsMonth;
