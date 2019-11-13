import React from 'react';
import { Link } from 'react-router-dom';
import './shifts-month.css';
import '../../app.css';
import TopMenuShift from '../../topmenu/topmenu-shift';
import DayOfMonth from './day-of-month-component';
import Legend from './shift-month-legends';
import {
  createDateObjFromDateString,
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
      date: new Date(),
      scheduledHoursForCurrentMonth: [],
      swapFlag: 0
    };
  }
  getData(url, methodToUse) {
    fetch(url, { method: methodToUse })
      .then(response => response.json())
      .then(monthShiftInfo => {
        this.setState({
          scheduledHoursForCurrentMonth: monthShiftInfo
        });
      })
      .catch(error => { throw (error); });
  }
  componentDidMount() {
    const swapFlag = this.props.location.state ? this.props.location.state.swapFlag : 0;
    const initialQuery = this.calculateQueryRange(this.props.defaultDate);
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
  calculateQueryRange(dateProp) {
    var selectedDate = new Date(dateProp);
    var firstDayOfMonth = new Date(selectedDate).setDate(1);
    var previousDate = new Date(firstDayOfMonth);
    while (previousDate.getDay() > 0) {
      previousDate = new Date(previousDate);
      previousDate.setDate(previousDate.getDate() - 1);
    }
    const unixCalendarStartRange = previousDate.getTime();
    const secondsTimestampStartRange = adjustLocalTimestampToUTCSeconds(unixCalendarStartRange) + '';
    var lastDayOfMonth = function (month, year) {
      return new Date(year, month, 0).getDate();
    };
    var lastDate = new Date(dateProp);
    lastDate.setDate(lastDayOfMonth(selectedDate.getMonth() + 1, selectedDate.getFullYear()));
    while (lastDate.getDay() !== 6) {
      lastDate = new Date(lastDate);
      lastDate.setDate(lastDate.getDate() + 1);
    }
    const unixCalendarEndRange = lastDate.getTime();
    const secondsTimestampEndRange = adjustLocalTimestampToUTCSeconds(unixCalendarEndRange) + '';
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
    var monthDivArray = [];
    var calendarPage = this.generateCalendarPage(dateProp);
    for (var dayOfCalendar = 0; dayOfCalendar < calendarPage.length;) {
      const monthWeekArray = [];
      for (let dayOfWeekIndex = 0; dayOfWeekIndex < 7; dayOfWeekIndex++, dayOfCalendar++) {
        var targetUnixDate = calendarPage[dayOfCalendar].getTime();
        monthWeekArray.push(
          <td
            key={calendarPage[dayOfCalendar].getTime()}
            className="align-middle p-0">
            <Link
              className={calendarPage[dayOfCalendar].getFullYear() +
                '-' + calendarPage[dayOfCalendar].getMonth() +
                '-' + calendarPage[dayOfCalendar].getDate() === new Date(this.props.defaultDate).getFullYear() +
              '-' + new Date(this.props.defaultDate).getMonth() +
              '-' + new Date(this.props.defaultDate).getDate() ? 'today-mark link-style ' : 'link-style'}
              to={{
                pathname: `/shifts/day/shifts-day/${this.getDateStringFromTimestamp(targetUnixDate)}`,
                state: {
                  swapFlag: this.state.swapFlag
                }
              }}>
              <DayOfMonth
                key={calendarPage[dayOfCalendar].getTime()}
                dayObj={calendarPage[dayOfCalendar]}
                dayIndex={calendarPage[dayOfCalendar].getDate()}
                shiftsArray={this.state.scheduledHoursForCurrentMonth}
              />
            </Link>
          </td>
        );
      }
      monthDivArray.push(
        <tr key={dayOfCalendar}>
          {monthWeekArray}
        </tr>
      );
    }
    return monthDivArray;
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
    // console.log("shiftsArray", shiftsArray);
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
            // console.log("array of rounds per week: ",arrayOfRoundsForWeek);
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
      dateToPass = createDateObjFromDateString(this.props.match.params.date);// converts unix time to date/at midnight 09/17/2019
      dateToPass = dateToPass.getTime();
    }
    if (!this.state.scheduledHoursForCurrentMonth) {
      return <div>No Shifts Available</div>;
    }
    return (
      <div className="mainCalendarContainer">
        <TopMenuShift userId={this.props.userId} title="MONTH" page='month' date={dateToPass} />
        <div className="calendarContainer d-flex mx-4">
          <table className="monthTable table h-100 m-0 border-bottom">
            <thead>
              <tr className="monthDays">
                <th scope="col">SUN</th>
                <th scope="col">MON</th>
                <th scope="col">TUE</th>
                <th scope="col">WED</th>
                <th scope="col">THU</th>
                <th scope="col">FRI</th>
                <th scope="col">SAT</th>
              </tr>
            </thead>
            <tbody className="monthDates">
              {this.displayCalendarPage(dateToPass)}
            </tbody>
          </table>
          <table className="weekTotal table h-100 m-0 border-bottom">
            <thead>
              <tr>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {this.displayWeeklyHours(this.generateCalendarPage(dateToPass), this.state.scheduledHoursForCurrentMonth)}
            </tbody>
          </table>
        </div>
        <div><Legend /></div>
      </div>
    );
  }
}

export default ShiftsMonth;
