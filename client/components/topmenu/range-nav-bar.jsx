import React from 'react';
import { Link } from 'react-router-dom';
import { getZeroPaddedNumber } from '../../lib/time-functions';
import './nav-styles.css';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.state = {
      date: new Date(this.props.dateString),
      dateArr: this.props.dateString.split('-')
    };
  }
  renderMenuDateText() {
    if (this.props.page === 'month') {
      return this.renderMonthText();
    }
    if (this.props.page === 'week') {
      return this.renderWeekText();
    }
    if (this.props.page === 'day') {
      return this.renderDayText();
    }
  }
  renderMonthText() {
    const year = this.state.dateArr[0];
    const month = this.month[this.state.dateArr[1] - 1];
    return month + ' ' + year;
  }
  renderWeekText() {
    const dateObj = new Date(this.props.dateString);
    const dayOfWeek = dateObj.getUTCDay();
    dateObj.setUTCDate(dateObj.getUTCDate() - dayOfWeek);
    const firstDayOfWeek = this.day[dateObj.getUTCDay()];
    const firstMonthOfWeek = this.month[dateObj.getUTCMonth()];
    const firstDateOfWeek = dateObj.getUTCDate();
    dateObj.setUTCDate(dateObj.getUTCDate() + 6);
    const lastDayOfWeek = this.day[dateObj.getUTCDay()];
    const lastMonthOfWeek = this.month[dateObj.getUTCMonth()];
    const lastDateOfWeek = dateObj.getUTCDate();
    return (firstDayOfWeek + ' ' + firstMonthOfWeek + ' ' + firstDateOfWeek + ' – ' +
            lastDayOfWeek + ' ' + lastMonthOfWeek + ' ' + lastDateOfWeek);
  }
  renderDayText() {
    const day = this.day[this.state.date.getUTCDay()];
    const month = this.month[this.state.dateArr[1] - 1];
    const date = this.state.dateArr[2];
    return day + ' ' + month + ' ' + date;
  }
  componentDidUpdate(prevProps) {
    if (prevProps.dateString !== this.props.dateString) {
      this.setState({
        date: new Date(this.props.dateString),
        dateArr: this.props.dateString.split('-')
      });
    }
  }
  getNextDateString(num) {
    if (this.props.page === 'month') {
      let nextMonth = new Date(this.props.dateString);
      nextMonth.setUTCMonth(nextMonth.getUTCMonth() + num);
      return `${nextMonth.getUTCFullYear()}-${getZeroPaddedNumber(nextMonth.getUTCMonth() + 1)}-${getZeroPaddedNumber(nextMonth.getUTCDate())}`;
    }
    if (this.props.page === 'day') {
      let nextDay = new Date(this.props.dateString);
      nextDay.setUTCDate(nextDay.getUTCDate() + num);
      return `${nextDay.getUTCFullYear()}-${getZeroPaddedNumber(nextDay.getUTCMonth() + 1)}-${getZeroPaddedNumber(nextDay.getUTCDate())}`;
    }
    if (this.props.page === 'week') {
      let nextWeek = new Date(this.props.dateString);
      nextWeek.setUTCDate(nextWeek.getUTCDate() + (num * 7));
      return `${nextWeek.getUTCFullYear()}-${getZeroPaddedNumber(nextWeek.getUTCMonth() + 1)}-${getZeroPaddedNumber(nextWeek.getUTCDate())}`;
    }
  }
  zeroPadNumber(number) {
    return ('0' + number).slice(-2);
  }
  generateNextTimestamp(baseTimestamp, distance, direction) {
    const currentDateObj = new Date(baseTimestamp);
    let currentDate = currentDateObj.getDate();
    currentDate += distance * direction;
    const newDateObject = new Date(baseTimestamp);
    newDateObject.setDate(currentDate);
    return {
      timestamp: newDateObject.getTime(),
      pathDate: `${newDateObject.getFullYear()}-${this.zeroPadNumber(newDateObject.getMonth() + 1)}-${this.zeroPadNumber(newDateObject.getDate())}`
    };
  }
  generateText() {
    const convertedDate = this.getDateObjFromDateString(this.props.date);
    if (this.props.page === 'day') {
      const dateString = convertedDate.toDateString();
      const dayText = dateString.slice(0, -5);
      // might need to add an available option
      return dayText;
    } if (this.props.page === 'month') {
      const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const dateString = convertedDate.toDateString();
      const year = dateString.slice(11);
      return month[convertedDate.getMonth()] + ' ' + year;
    } if (this.props.page === 'week') {
      const convertedDate = new Date(this.props.date);
      const numericDay = convertedDate.getUTCDay();
      var startDay = new Date(this.props.date);
      startDay.setDate(startDay.getDate() - numericDay);
      var startDayText = startDay.toDateString().slice(0, -5);
      var endDay = new Date(this.props.date);
      endDay.setDate(endDay.getDate() + 6 - numericDay);
      var endDayText = endDay.toDateString().slice(0, -5);
      return startDayText + ' - ' + endDayText;
    }
  }
  getDateObjFromDateString(dateString) {
    const convertedDate = new Date();
    if (typeof dateString === 'string') {
      const arrayDate = dateString.split('-');
      const dateObj = {
        year: arrayDate[0],
        month: arrayDate[1] - 1,
        date: arrayDate[2]
      };
      convertedDate.setFullYear(dateObj.year);
      convertedDate.setMonth(dateObj.month);
      convertedDate.setDate(dateObj.date);
    } else {
      convertedDate.setTime(dateString);
    }
    return convertedDate;
  }
  render() {
    const daysInRange = {
      'week': { number: 7, route: '/shifts/week/shifts-week' },
      'day': { number: 1, route: '/shifts/day/shifts-day' },
      'month': { number: 30, route: '/shifts/month/shifts-month' }
      // might need to add an availabile route
    };
    const leftRoute = this.getNextDateString(-1);
    const rightRoute = this.getNextDateString(1);
    return (
      <React.Fragment>
        <Link to={`${daysInRange[this.props.page].route}/${leftRoute}`}><div className="arrow arrowLeft" ></div></Link>
        <div className="font-weight-bold">{this.renderMenuDateText()}</div>
        <Link to={`${daysInRange[this.props.page].route}/${rightRoute}`}> <div className="arrow arrowRight" ></div></Link>
      </React.Fragment>
    );
  }
}

export default Nav;
