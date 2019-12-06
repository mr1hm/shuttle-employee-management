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
  getWorkingHours
} from '../../../lib/time-functions';

class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.id = '&id=' + this.props.userId;
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
    const today = new Date(this.props.match.params.date);
    const swapFlag = this.props.location.state ? this.props.location.state.swapFlag : 0;
    const initialQuery = this.calculateQueryRange(this.props.match.params.date);
    this.getData('/api/shifts-month.php' + initialQuery + this.id, 'GET');
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
    const query = `?unixstart=${firstDateString}&unixend=${lastDateString}`;
    return query;
  }

  getData(url, methodToUse) {
    fetch(url, { method: methodToUse })
      .then(response => response.json())
      .then(monthShiftInfo => {
        console.log('data: ', monthShiftInfo);
        this.setState({
          scheduledHoursForCurrentMonth: monthShiftInfo
        });
        this.renderCalendar();
      })
      .catch(error => { throw (error); });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.date !== this.props.match.params.date) {
      const newQuery = this.calculateQueryRange(this.props.match.params.date);
      this.getData('/api/shifts-month.php' + newQuery + this.id, 'GET');
    }
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
          </div>
        </div>
        <div><Legend /></div>
      </div>
    );
  }
}

export default ShiftsMonth;
