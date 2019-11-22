import React from 'react';
import { Link } from 'react-router-dom';
import './shifts-month.css';
import '../../app.css';
import TopMenuShift from '../../topmenu/topmenu-shift';
import DayOfMonth from './day-of-month-component';
import Legend from './shift-month-legends';
import {
  getZeroPaddedNumber,
  getLocalDateString,
  getDateString,
  calculateShiftHours,
  adjustLocalTimestampToUTCSeconds,
  adjustUTCSecondsToLocalTimestamp,
  convertUnixMonthDay
} from '../../../lib/time-functions';

class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.id = '&id=' + this.props.userId;
    this.state = {
      today: new Date(),
      date: new Date(this.props.match.params.date),
      shiftsForEachDay: {},
      scheduledHoursForCurrentMonth: [],
      swapFlag: 0
    };
  }
  getMonthInfo() {
    const dateObj = new Date(this.props.match.params.date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const numOfDaysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { numOfDaysInMonth: numOfDaysInMonth, firstDayOfMonth: firstDayOfMonth };
  }
  renderCalendar() {
    console.log('param: ', this.props.match.params.date);
    const todayString = getLocalDateString(this.state.today);
    const dateObj = new Date(this.props.match.params.date);
    const currentString = getLocalDateString(dateObj);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const monthInfo = this.getMonthInfo();
    const dayOffset = monthInfo.firstDayOfMonth;
    const numOfDaysInMonth = monthInfo.numOfDaysInMonth;
    const monthElements = [];
    for (let monthDayIndex = 1 - dayOffset; monthDayIndex <= numOfDaysInMonth;) {
      const weekElement = [];
      for (let weekDayIndex = 0; weekDayIndex < 7; weekDayIndex++, monthDayIndex++) {
        weekElement.push(
          <td key={monthDayIndex} className="align-middle p-0">
            {monthDayIndex < 1 || monthDayIndex > numOfDaysInMonth ? <div></div> : <Link
              className=
                {currentString === todayString ? 'today-mark link-style ' : 'link-style'}
              to={{
                pathname: `/shifts/day/shifts-day/${year}-${this.getZeroPaddedNumber(month)}-${monthDayIndex < 10 ? '0' + monthDayIndex : monthDayIndex}`,
                state: {
                  swapFlag: this.state.swapFlag
                }
              }}>
              <DayOfMonth
                dayObj={new Date(dateObj.setDate(monthDayIndex))}
                dayIndex={monthDayIndex > 0 && monthDayIndex <= numOfDaysInMonth ? monthDayIndex : ''}
                shiftsArray={this.state.scheduledHoursForCurrentMonth}
              />
            </Link>}
          </td>
        );
      }
      monthElements.push(
        <tr key={monthDayIndex} >
          {weekElement}
        </tr>
      );
    }
    return monthElements;
  }
  getData(url, methodToUse) {
    fetch(url, { method: methodToUse })
      .then(response => response.json())
      .then(monthShiftInfo => {
        console.log('data: ', monthShiftInfo);
        this.setState({
          scheduledHoursForCurrentMonth: monthShiftInfo
        });
      })
      .catch(error => { throw (error); });
  }
  componentDidMount() {
    const today = new Date(this.props.match.params.date);
    const swapFlag = this.props.location.state ? this.props.location.state.swapFlag : 0;
    const initialQuery = this.calculateQueryRange(this.props.match.params.date);
    this.getData('/api/shifts-month.php' + initialQuery + this.id, 'GET');
    this.setState({
      swapFlag: swapFlag
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.date !== this.props.match.params.date) {
      const newQuery = this.calculateQueryRange(this.props.match.params.date);
      this.getData('/api/shifts-month.php' + newQuery + this.id, 'GET');
    }
  }
  calculateQueryRange(dateString) {
    const currentDate = new Date(dateString);
    const firstDayOfMonth = new Date(dateString);
    firstDayOfMonth.setUTCDate(1);
    const firstDateString = getDateString(firstDayOfMonth);
    const getlastDayOfMonth = function (month, year) {
      return new Date(year, month, 0).getUTCDate();
    };
    const lastDayOfMonth = new Date(dateString);
    lastDayOfMonth.setUTCDate(getlastDayOfMonth(currentDate.getUTCMonth() + 1, currentDate.getUTCFullYear()));
    const lastDateString = getDateString(lastDayOfMonth);
    const query = `?unixstart=${firstDateString}&unixend=${lastDateString}`;
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
  chunkArray(calendarArray, chunkSize) {
    var calenderIndex = 0;
    var calendarArrayLength = calendarArray.length;
    var bundledWeeksArray = [];
    for (calenderIndex = 0; calenderIndex < calendarArrayLength; calenderIndex += chunkSize) {
      var weekChunk = calendarArray.slice(calenderIndex, calenderIndex + chunkSize);
      bundledWeeksArray.push(weekChunk);
    }
    return bundledWeeksArray;
  }
  getZeroPaddedNumber(number) { // could be moved to time-function.jsx get last two number of string exmple: input:getZeroPaddedNumber(8449897897)
    return ('0' + number).slice(-2);// Output: "97"
  }
  getDateStringFromTimestamp(timestamp) { // The convertUnixMonthDay(time) function from shifts-day.jsx could be used here 09/17/2019
    const date = new Date(parseInt(timestamp));
    return `${date.getFullYear()}-${this.getZeroPaddedNumber(date.getMonth() + 1)}-${this.getZeroPaddedNumber(date.getDate())}`;
  }
  displayWeeklyHours(calendarPage, shiftsArray) {
    var weekTotalHoursArrayToBeDisplayed = [];
    var arrayOfRoundsForWeek = [];
    var bundledWeeksArray = this.chunkArray(calendarPage, 7);
    var weekHourTotal = null;
    for (var weekIndex = 0; weekIndex < bundledWeeksArray.length; weekIndex++) {
      for (var dateIndex = 0; dateIndex < bundledWeeksArray[weekIndex].length; dateIndex++) {
        for (var roundIndex = 0; roundIndex < shiftsArray.length; roundIndex++) {
          const calendarTimestamp = bundledWeeksArray[weekIndex][dateIndex].getTime();
          const shiftTimestamp = parseInt(adjustUTCSecondsToLocalTimestamp(shiftsArray[roundIndex].date));
          const calendarTimestampToStringDate = convertUnixMonthDay(calendarTimestamp);
          const shiftTimestampToStringDate = convertUnixMonthDay(shiftTimestamp);
          if (calendarTimestampToStringDate === shiftTimestampToStringDate) {
            arrayOfRoundsForWeek.push(shiftsArray[roundIndex]);
          }
          weekHourTotal = this.calculateSumOfHoursScheduledForWeek(arrayOfRoundsForWeek);
        }
      }
      if (!weekHourTotal) {
        weekHourTotal = 'No Shifts';
      }
      var targetUnixDate = bundledWeeksArray[weekIndex][0].getTime();
      arrayOfRoundsForWeek = [];
      weekTotalHoursArrayToBeDisplayed.push(
        <tr key={weekIndex}>
          <td className="align-middle p-0">
            <Link key={bundledWeeksArray[weekIndex][0].getTime()}
              className="link-style"
              to={`/shifts/week/shifts-week/${this.getDateStringFromTimestamp(targetUnixDate)}`}>
              <div className="weekHours d-flex justify-content-center align-items-center">
                {weekHourTotal}
              </div>
            </Link>
          </td>
        </tr>

      );
    }
    // console.log("array of rounds per week: ",arrayOfRoundsForWeek)
    return weekTotalHoursArrayToBeDisplayed;
  }
  calculateSumOfHoursScheduledForWeek(arrayOfRoundsForWeek) {
    if (arrayOfRoundsForWeek.length) {
      let totalShiftLengthForWeek = 0;
      for (let roundIndex = 0; roundIndex < arrayOfRoundsForWeek.length; roundIndex++) {
        let roundToCalculate = arrayOfRoundsForWeek[roundIndex];
        let hoursForShift = calculateShiftHours(roundToCalculate.start_time, roundToCalculate.end_time);
        totalShiftLengthForWeek += hoursForShift;
      }
      let totalHours = Math.floor(totalShiftLengthForWeek / 60);
      let totalMinutes = totalShiftLengthForWeek % 60;
      return (totalHours + 'h ' + totalMinutes + 'm');
    } else return 'No Shifts';
  }
  render() {
    if (this.props.match.params.date === undefined) {
      var dateToPass = this.props.defaultDate;
    } else {
      dateToPass = new Date(this.props.match.params.date);// converts unix time to date/at midnight 09/17/2019
      dateToPass = dateToPass.getTime();
    }
    if (!this.state.scheduledHoursForCurrentMonth) {
      return <div>No Shifts Available</div>;
    }
    return (
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
                {this.renderCalendar()}
              </tbody>
            </table>
            <table className="weekTotal table h-100 m-0 border-bottom">
              <thead>
                <tr>
                  <th className="p-0" >TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {this.displayWeeklyHours(this.generateCalendarPage(dateToPass), this.state.scheduledHoursForCurrentMonth)}
              </tbody>
            </table>
          </div>
        </div>
        <div><Legend /></div>
      </div>
    );
  }
}

export default ShiftsMonth;
