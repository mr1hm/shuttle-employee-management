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

  convertUnixMonth(time) {
    const convertedDate = new Date(time);
    const dateString = "" + convertedDate;
    const arrayDateString = dateString.split(' ');
    console.log('converted array month function:', arrayDateString)
    return arrayDateString[1].toUpperCase();
  }
  convertUnixDay(time) {
    const convertedDate = new Date(time);
    const dateString = "" + convertedDate;
    const arrayDateString = dateString.split(' ');
    console.log('converted array day function:', arrayDateString)
    return arrayDateString[0] + ' ' + arrayDateString[1];
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

  //need to add Week time conversion functions
  //eventually need to remove time conversion functions here and instead reference helper functions file --- /lib/time-functions.jsx

  leftArrowContent() {
    var currentDate, content;
    if (this.props.page === 'month') {
    //eventually this will have to be adjust to accomodate months of slightly different lengths
      currentDate = this.state.date - 30*(86400);
      console.log('left arrow (previous month) unix:', currentDate);
      content = this.convertUnixMonth(currentDate);
      console.log('left arrow (previous month) coverted to text:', content);
      this.setState({
        date: currentDate,
        centerContent: content
      })
      // } else if (this.props.page === 'week') {
      //add week content here
      //   })

    } else if (this.props.page === 'day') {
      this.generateTextDay(this.state.date, -1);
    }
  }
  rightArrowContent() {
    var currentDate, content;
    if (this.props.page === 'month') {
      //eventually this will have to be adjust to accomodate months of slightly different lengths
      var day = new Date('Apr 30, 2000');
      console.log(day); // Apr 30 2000
      var nextDay = new Date(day);
      nextDay.setDate(day.getDate()+1);
      console.log(nextDay); // May 01 2000    
      currentDate = this.state.date + 30*(86400);
      console.log('right arrow (next month) unix:', currentDate);
      content = this.convertUnixMonth(currentDate);
      console.log('right arrow (next month) coverted to text:', content);
      this.setState({
        date: currentDate,
        centerContent: content
      })

      //} else if (this.props.page === 'week') {
      //entire content needs to be adjusted to include first day and last day of week
      // currentDate = this.state.date + 7*(86400);
      // console.log('right arrow (next day) day unix:', currentDate);
      // content = this.convertUnixDay(currentDate);
      // console.log('right arrow (next day) day coverted to day:', content);
      // this.setState({
      //   date: currentDate,
      //   centerContent: content
      // })
    } else if (this.props.page === 'day') {
        this.generateTextDay(this.state.date, 1);
      }
  }
  
  render(){
    // let linkingLocation = `../shifts/${this.props.page}`;
    return (
      <div className="weekSelectionContainer">
        {/* leftover code -- need to change classNames to reflect more generic nav, will do later since it is CSS*/}
        <div className="weekSelector weekDropDown weekDropDownLeft" onClick={this.leftArrowContent}></div>
        <div className="weekSelection">{this.state.centerContent}</div>
        {/* leftover code -- need to change classNames to reflect more generic nav, will do later since it CSS*/}
        <div className="weekSelector weekDropDown weekDropDownRight" onClick={this.rightArrowContent}></div>
      </div>  
    );
  }
}

export default Nav;
