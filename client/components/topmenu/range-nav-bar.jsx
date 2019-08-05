//TODO: There is quite a bit of repeated code for date manipulation. Eventually the common code should be placed into functions.

import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import './nav-styles.css';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.date,
      centerContent: null
    }
    this.leftArrowContent = this.leftArrowContent.bind(this);
    this.rightArrowContent = this.rightArrowContent.bind(this);
  }

  daysInMonth(time) {
    var day = new Date(time);
    var stringDay = ''+ day;
    console.log(stringDay)
    var month = stringDay.slice(-53, -50);
    console.log(month)
    if (month === "Apr" || month === "Jun" || month === "Sep" || month === "Nov") {
    return 30;
    }
    //TODO: Deal with case where these is a leap year.
    if (month === 'Feb') {
      return 28;
    } else {
      return 31;
    }
   }

  generateTextDay(incomingDate, increment) {
    var day = new Date(incomingDate);
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + increment);
    this.setState({
      date: nextDay.getTime()
    })
    const convertedDate = new Date(nextDay);
    const dateString = "" + convertedDate;
    const dayText = dateString.slice(-64, -47);
    this.setState({
      centerContent: dayText
    })
  }

  generateTextMonth(incomingDate, increment) {
    var day = new Date(incomingDate);
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + increment);
    this.setState({
      date: nextDay.getTime()
    })
    const convertedDate = new Date(nextDay);
    const dateString = "" + convertedDate;
    const monthText = dateString.slice(-53, -50);
    this.setState({
      centerContent: monthText
    })
  }

  leftArrowContent() {
    if (this.props.page === 'month') {
      console.log(this.props.page);
      var numberDays = this.daysInMonth(this.state.date);
      console.log(numberDays);
      this.generateTextMonth(this.state.date, - numberDays);

      // } else if (this.props.page === 'week') {
      //TODO: add week content here
      //   })

    } else if (this.props.page === 'day') {
      this.generateTextDay(this.state.date, -1);
    }
  }
  rightArrowContent() {
    if (this.props.page === 'month') {
      var numberDays = this.daysInMonth(this.state.date);
      this.generateTextMonth(this.state.date, numberDays);

      //} else if (this.props.page === 'week') {
      //TODO: add week content here
      // })
    
    } else if (this.props.page === 'day') {
        this.generateTextDay(this.state.date, 1);
      }
  }
  //TODO: I do not have a way of testing the routing code right now. As soon as I have functioning endpoint codes, I will debug this code.
  render(){
    var linkingLocation = `../shifts/${this.props.page}`;
    return (
      <React.Fragment>
      <div className="weekSelectionContainer">
        {/* TODO: This is leftover code -- need to change classNames to reflect more generic nav, will do later since it is CSS*/}
        <div className="weekSelector weekDropDown weekDropDownLeft" onClick={this.leftArrowContent}><Link to={linkingLocation}></Link></div>
        <div className="weekSelection">{this.state.centerContent}</div>
        {/* TODO: this is leftover code -- need to change classNames to reflect more generic nav, will do later since it CSS*/}
        <div className="weekSelector weekDropDown weekDropDownRight" onClick={this.rightArrowContent}><Link to={linkingLocation}></Link></div>
      </div>  
      <Switch>
        <Route path = "../shifts/week" render={(props) => <ShiftsWeek {...props} date={this.state.date}  />}/>
        <Route path = "../shifts/day" render={(props) => <ShiftsDay {...props} date={this.state.date}  />}/>
        <Route path = "../shifts/month" render={(props) => <ShiftsMonth {...props} date={this.state.date}  />}/>    
      </Switch>
      </React.Fragment>
    );
  }
}

export default Nav;
