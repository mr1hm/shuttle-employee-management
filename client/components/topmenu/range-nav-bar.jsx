//TODO: There is quite a bit of repeated code for date manipulation. Eventually the common code should be placed into functions.

//TODO: There is a A LOT OF GARBAGE CODE, but I don't want delete yet.

import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import './nav-styles.css';

class Nav extends React.Component {
  // constructor(props) {
  //   super(props);
    // this.state = {
    //   centerContent: null
    // }
    // this.leftArrowContent = this.leftArrowContent.bind(this);
    // this.rightArrowContent = this.rightArrowContent.bind(this);
  // }

  // daysInMonth(time) {
  //   var day = new Date(time);
  //   var stringDay = ''+ day;
  //   console.log(stringDay)
  //   var month = stringDay.slice(-53, -50);
  //   console.log(month)
  //   if (month === "Apr" || month === "Jun" || month === "Sep" || month === "Nov") {
  //   return 30;
  //   }
  //   //TODO: Deal with case where these is a leap year.
  //   if (month === 'Feb') {
  //     return 28;
  //   } else {
  //     return 31;
  //   }
  //  }

  generateLeftTimestamp(incomingDate) {
    if (this.props.page === 'day') {
    var day = new Date(incomingDate);
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() - 1);
    var nextTimestamp = nextDay.getTime();
    return `/shifts/week/shifts-day/${nextTimestamp}`;
    }
  }
  generateRightTimestamp(incomingDate) {
    if (this.props.page === 'day') {
    var day = new Date(incomingDate);
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() - 1);
    var nextTimestamp = nextDay.getTime();
    return `/shifts/week/shifts-day/${nextTimestamp}`;
    }
  }

  generateText(){
    if (this.props.page === 'day') {
    const convertedDate = new Date(this.props.date);
    const dateString = "" + convertedDate;
    const dayText = dateString.slice(-64, -47);
    return dayText;
    }
  }

  // generateTextMonth(incomingDate, increment) {
  //   var day = new Date(incomingDate);
  //   var nextDay = new Date(day);
  //   nextDay.setDate(day.getDate() + increment);
  //   var nextTimestamp = nextDay.getTime();
  //   const convertedDate = new Date(nextDay);
  //   const dateString = "" + convertedDate;
  //   const monthText = dateString.slice(-53, -50);
  //   this.setState({
  //     centerContent: monthText
  //   })
  //   `/shifts/week/shifts-month/${nextTimestamp}`;
  // }
  //TODO: displayCurrentWeekRange still needs to be set-up to work properly in this module. 
  // displayCurrentWeekRange() {
  //   var startDate = new Date(this.props.date);
  //   var startTimeStamp = startDate.getTime();
  //   var endDate = new Date(startTimeStamp);
  //   endDate.setDate(endDate.getDate() + 7);
  //   //need to correct these dates once I have the real data coming in
  //   var startDateString = startDate.toDateString().slice(0, -5);
  //   var endDateString = endDate.toDateString().slice(0, -5);
  //   this.setState({
  //     centerContent: `${startDateString} - ${endDateString}`
  //   })
  //   return `/shifts/week/shifts-week/${nextTimestamp}`;
  // }

  // leftArrowActions() {
  //   if (this.props.page === 'month') {
  //   //   var numberDays = this.daysInMonth(this.props.date);
  //   //   this.generateTextMonth(this.props.date, - numberDays);

  //  } else if (this.props.page === 'week') {
  //   //   //TODO: Need to pass positive and negative increments. Will not be done until props being received.
  //   //   this.displayCurrentWeekRange();

  //   } else if (this.props.page === 'day') {
  //     this.generateTextDay(this.props.date, -1);
  //     this.generateCenterText(this.props.date, -1);
  //   }
  // }
  // rightArrowAction() {
  //   if (this.props.page === 'month') {
  //     // var numberDays = this.daysInMonth(this.props.date);
  //     // this.generateTextMonth(this.props.date, numberDays);
    
  //   } else if (this.props.page === 'week') {
  //     // //TODO: Need to pass positive and negative increments. Will not be done until props being received.
  //     // displayCurrentWeekRange();

  //   } else if (this.props.page === 'day') {
  //       this.generateTextDay(this.props.date, 1);
  //       this.generateCenterText(this.props.date, 1)
  //   }
  // }

  render(){
    var leftRoute = this.generateLeftTimestamp(this.props.date);
    var rightRoute =  this.generateRightTimestamp(this.props.date);

    return (
      <div className="weekSelectionContainer">
        {/* TODO: This is leftover code --  do later since CSS*/}
        <Link to={leftRoute}><div className="weekSelector weekDropDown weekDropDownLeft" ></div></Link>
        <div className="weekSelection">{this.generateText()}</div>
        {/* TODO: This is leftover code --  do later since CSS*/}
        <Link to={rightRoute}> <div className="weekSelector weekDropDown weekDropDownRight" ></div></Link>
      </div>  
    );
  }
}

export default Nav;
