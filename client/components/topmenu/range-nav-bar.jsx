import React from 'react';
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
    console.log()
    return arrayDateString[1].toUpperCase();
  }
  convertUnixDay(time) {
    const convertedDate = new Date(time);
    const dateString = "" + convertedDate;
    const arrayDateString = dateString.split(' ');
    console.log(arrayDateString);
    return arrayDateString[0].toUpperCase();
  }

  leftArrowContent() {
    var currentDate, content;

    if (this.props.page === 'month') {
    //eventually this will have to be adjust to accomodate months of slightly different lengths
      currentDate = this.state.date - 30*(86400);
      content = this.convertUnixMonth(currentDate);
      this.setState({
        date: currentDate,
        centerContent: content
      })
    // } else if (this.props.page === 'week') {
    //entire content needs to adjusted to include first day and last day of week
    //   currentDate = this.state.date - 7*(86400);
    //   content = this.convertUnixDay(currentDate);
    //   this.setState({
    //     date: currentDate,
    //     centerContent: content
    //   })
    } else if (this.props.page === 'day') {
      currentDate = this.state.date - 86400;
      console.log('left arrow (previous day) day unix:', currentDate);
      content = this.convertUnixDay(currentDate);
      console.log('right arrow (previous day) day coverted to text:', content);
      this.setState({
        date: currentDate,
        centerContent: content
      })
    }
  }
  rightArrowContent() {
    var currentDate, content;
    if (this.props.page === 'month') {
      //eventually this will have to be adjust to accomodate months of slightly different lengths
      currentDate = this.state.date + 30*(86400);
      content = this.convertUnixMonth(currentDate);
      this.setState({
        date: currentDate,
        centerContent: content
      })
    //} else if (this.props.page === 'week') {
      //entire content needs to adjusted to include first day and last day of week
      // currentDate = this.state.date + 7*(86400);
      // console.log('right arrow (next day) day unix:', currentDate);
      // content = this.convertUnixDay(currentDate);
      // console.log('right arrow (next day) day coverted to day:', content);
      // this.setState({
      //   date: currentDate,
      //   centerContent: content
      // })
    } else if (this.props.page === 'day') {
      currentDate = this.state.date + 86400;
      console.log('right arrow (next day) day unix:', currentDate);
      content = this.convertUnixDay(currentDate);
      console.log('right arrow (next day) day coverted to text:', content);
      this.setState({
        date: currentDate,
        centerContent: content
      })
    }
  }

  render(){
    return (
      <div className="weekSelectionContainer">
        {/* add a click handler to process the click to the left
        based on click handler fetch certain data
        change the name in the center of the page based on what is passed by props
        populate page based on new data from new fetch
        change the content on the page*/}
        <div className="weekSelector weekDropDown weekDropDownLeft" onClick={this.leftArrowContent}>{this.state.centerContent}</div>
        <div className="weekSelection"></div>
        {/* add a click handler to process the click to the left
        based on click handler fetch certain data
        change the name in the center of the page based on what is passed by props
        populate page based on new data from new fetch
        change the content on the page*/}
        <div className="weekSelector weekDropDown weekDropDownRight" onClick={this.rightArrowContent}></div>
      </div>
    );
  }
}

export default Nav;
