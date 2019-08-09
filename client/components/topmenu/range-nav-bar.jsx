import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import './nav-styles.css';

class Nav extends React.Component {

  zeroPadNumber( number ){
    return ('0' + number).slice(-2);
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

  generateText(){
    const convertedDate = this.getDateObjFromDateString( this.props.date );
    if (this.props.page === 'day') {
      const dateString = convertedDate.toDateString()
      const dayText = dateString.slice(0,-5);
      return dayText;
    } if (this.props.page === 'month'){
      const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const dateString = convertedDate.toDateString()
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
    return convertedDate;
  }

  render(){
    const daysInRange = {
      'week' : { number: 7, route: '/shifts/week/shifts-week'},
      'day': { number: 1, route: '/shifts/day/shifts-day'},
      'month': { number: 30, route: '/shifts/month/shifts-month'}
    }

    const leftRoute = this.generateNextTimestamp( this.getDateObjFromDateString( this.props.date ), daysInRange[this.props.page].number, -1 ).pathDate;

    const rightRoute = this.generateNextTimestamp( this.getDateObjFromDateString( this.props.date ), daysInRange[this.props.page].number, 1 ).pathDate;

    return (
      <React.Fragment>
        <Link to={`${daysInRange[this.props.page].route}/${leftRoute}`}><div className="arrow arrowLeft" ></div></Link>
        <div className="font-weight-bold">{this.generateText()}</div>
        <Link to={`${daysInRange[this.props.page].route}/${rightRoute}`}> <div className="arrow arrowRight" ></div></Link>
      </React.Fragment>
    );
  }
}

export default Nav;
