import React from 'react';
import { getDateString, returnWeekInfoArray } from '../lib/time-functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import './admin-shifts-display.css';

export default class AdminWeekNav extends React.Component {
  constructor(props) {
    super(props);
    this.unixDayOffset = 86400;
    this.state = {
      dateString: this.props.date,
      weekArray: returnWeekInfoArray(this.props.date)
    };
    this.handleClickDayOfWeek = this.handleClickDayOfWeek.bind(this);
    this.handleClickPrevWeek = this.handleClickPrevWeek.bind(this);
    this.handleClickNextWeek = this.handleClickNextWeek.bind(this);
  }
  checkIfCurrentDay(dateString) {
    if (dateString === this.state.dateString) {
      return 'list-group-item-primary';
    }
    return '';
  }
  handleClickDayOfWeek(event) {
    this.props.onClickDayOfWeek(event.currentTarget.id);
    this.setState({
      dateString: event.currentTarget.id
    });
  }
  handleClickPrevWeek() {
    const newDate = new Date(this.state.dateString);
    newDate.setUTCDate(newDate.getUTCDate() - 7);
    const newDateString = getDateString(newDate);
    this.props.onClickDayOfWeek(newDateString);
    this.setState({
      dateString: newDateString,
      weekArray: returnWeekInfoArray(newDateString)
    });
  }
  handleClickNextWeek() {
    const newDate = new Date(this.state.dateString);
    newDate.setUTCDate(newDate.getUTCDate() + 7);
    const newDateString = getDateString(newDate);
    this.props.onClickDayOfWeek(newDateString);
    this.setState({
      dateString: newDateString,
      weekArray: returnWeekInfoArray(newDateString)
    });
  }
  renderDays() {
    const elements = this.state.weekArray.map((dayObj, index) => {
      return (
        <div
          key={dayObj.dateString}
          id={dayObj.dateString}
          onClick={this.handleClickDayOfWeek}
          className={`dayOfWeekContainer d-flex flex-column justify-content-center align-items-center py-2 ${this.checkIfCurrentDay(dayObj.dateString)} list-group-item list-group-item-action`}>
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
