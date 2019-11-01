import React from 'react';
import { returnWeekInfoArray } from '../lib/time-functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import './admin-shifts-display.css';

export default class AdminWeekNav extends React.Component {
  constructor(props) {
    super(props);
    this.unixDayOffset = 86400;
    this.state = {
      day: this.props.date,
      weekArray: returnWeekInfoArray(this.props.date)
    };
    this.handleClickDayOfWeek = this.handleClickDayOfWeek.bind(this);
    this.handleClickPrevWeek = this.handleClickPrevWeek.bind(this);
    this.handleClickNextWeek = this.handleClickNextWeek.bind(this);
  }
  checkIfCurrentDay(timestamp) {
    if (timestamp === this.props.date) {
      return 'list-group-item-primary';
    }
    return '';
  }
  handleClickDayOfWeek(event) {
    this.props.onClickDayOfWeek(parseInt(event.currentTarget.id));
  }
  handleClickPrevWeek() {
    var newDay = this.state.weekArray[0].unix - this.unixDayOffset;
    this.props.onClickDayOfWeek(parseInt(newDay));
    this.setState({
      day: newDay,
      weekArray: returnWeekInfoArray(newDay)
    });
  }
  handleClickNextWeek() {
    var newDay = this.state.weekArray[6].unix + this.unixDayOffset;
    this.props.onClickDayOfWeek(newDay);
    this.setState({
      day: newDay,
      weekArray: returnWeekInfoArray(newDay)
    });
  }
  renderDays() {
    const elements = this.state.weekArray.map((dayObj, index) => {
      return (
        <div
          key={dayObj.unix}
          id={dayObj.unix}
          onClick={this.handleClickDayOfWeek}
          className={`dayOfWeekContainer d-flex flex-column justify-content-center align-items-center py-2 ${this.checkIfCurrentDay(dayObj.unix)} list-group-item list-group-item-action`}>
          <div className="dayOfWeek">{dayObj.day}</div>
          <div className="currentMonth">{dayObj.month} {dayObj.date.getUTCDate()}</div>
        </div>
      );
    });
    return elements;
  }
  render() {
    return (
      <div className="adminShiftsWeekNav adminShiftWeekContainer d-flex justify-content-center list-group-horizontal">
        <div
          onClick={this.handleClickPrevWeek}
          className="prevWeekButton d-flex justify-content-center align-items-center list-group-item list-group-item-action rounded-left">
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </div>
        {this.renderDays()}
        <div
          onClick={this.handleClickNextWeek}
          className="nextWeekButton d-flex justify-content-center align-items-center list-group-item list-group-item-action rounded-right">
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </div>
      </div>
    );
  }
}
