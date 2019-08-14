import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import './nav-styles.css';

class Nav extends React.Component {

  zeroPadNumber( number ){
    return ('0' + number).slice(-2);
  }

  convertUnixTime(time) {
    const convertedDate = new Date(time);
    const dateString = convertedDate.toString();
    const arrayDateString = dateString.split(' ');
    const dayOfWeek = arrayDateString[0];
    const month = arrayDateString[1];
    const date = arrayDateString[2];
    return dayOfWeek + ', ' + month + ' ' + date;
  }

  generateNextTimestamp( baseTimestamp, distance, direction ){
    const currentDateObj = new Date(baseTimestamp);
    let currentDate = currentDateObj.getDate();
    currentDate += distance * direction;
    const newDateObject = new Date(baseTimestamp);
    newDateObject.setDate(currentDate);
    return {
      timestamp: newDateObject.getTime(),
      pathDate: `${newDateObject.getFullYear()}-${this.zeroPadNumber(newDateObject.getMonth()+1)}-${this.zeroPadNumber(newDateObject.getDate())}`
    }
  }

  generateStartOfWeekTimestamp(time) {
    const convertedDateStart = new Date(time);
    const convertedDate = new Date(convertedDateStart);
    const finalConvertedDate = convertedDate.getUTCDay();
    
    return time - finalConvertedDate * 86400000;
  }

  generateEndOfWeekTimestamp(time) {
    const convertedDateStart = new Date(time);
    const convertedDate = new Date(convertedDateStart);
    const finalConvertedDate = convertedDate.getUTCDay();
  
    return time + (6 - finalConvertedDate) * 86400000;
  }

  generateText(){
    const convertedDate = this.getDateObjFromDateString( this.props.date );
    if (this.props.page === 'day') {
      const dateString = convertedDate.toDateString()
      const dayText = dateString.slice(0,-5);
      return dayText;
    } if (this.props.page === 'month'){
      const dateString = convertedDate.toDateString()
      const monthText = dateString.slice(4,-8);
      return monthText;
    } if (this.props.page === 'week') {
      var startOfWeek = this.generateStartOfWeekTimestamp(this.props.date);
      var endOfWeek = this.generateEndOfWeekTimestamp(this.props.date);
      return this.convertUnixTime(startOfWeek) + ' - ' + this.convertUnixTime(endOfWeek)
    }
  }

  getDateObjFromDateString( dateString ){
    const convertedDate = new Date();
    if(typeof dateString === 'string'){
      const arrayDate = dateString.split('-');
      const dateObj = {
        year: arrayDate[0],
        month: arrayDate[1]-1,
        date: arrayDate[2]
      }
      convertedDate.setFullYear(dateObj.year);
      convertedDate.setMonth(dateObj.month);
      convertedDate.setDate(dateObj.date);
    } else {
      convertedDate.setTime(dateString);
    }
    return  convertedDate;
  }

  render(){
    const daysInRange = {
      'week' : { number: 7, route: '/shifts/week/shifts-week'},
      'day': { number: 1, route: '/shifts/day/shifts-day'},
      'month': { number: 30, route: '/shifts/months/shifts-month'}
    }

    const leftRoute = this.generateNextTimestamp( this.getDateObjFromDateString( this.props.date ), daysInRange[this.props.page].number, -1 ).pathDate;

    const rightRoute = this.generateNextTimestamp( this.getDateObjFromDateString( this.props.date ), daysInRange[this.props.page].number, 1 ).pathDate;

    return (
      <div className="weekSelectionContainer">
        {/* TODO: This is leftover code --  do later since CSS*/}
        <Link to={`${daysInRange[this.props.page].route}/${leftRoute}`}><div className="weekSelector weekDropDown weekDropDownLeft" ></div></Link>
        <div className="weekSelection">{this.generateText()}</div>
        {/* TODO: This is leftover code --  do later since CSS*/}
        <Link to={`${daysInRange[this.props.page].route}/${rightRoute}`}> <div className="weekSelector weekDropDown weekDropDownRight" ></div></Link>
      </div>  
    );
  }
}

export default Nav;
