import React from 'react';
import './shifts-week.css';
import HoursOfOperation from './hours-of-operation';
import ShiftsWeekDay from './shifts-week-day';
import TopMenuShift from '../../topmenu/topmenu-shift';
import {
  createDateObjFromDateString,
  adjustLocalTimestampToUTCSeconds,
  adjustUTCSecondsToLocalTimestamp
} from '../../../lib/time-functions';

class ShiftsWeek extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      userId: this.props.userId
    };
  }
  generateFullWeekOfTimestamps(time) {
    const convertedDateStart = createDateObjFromDateString(time);// converts unix time to date/at midnight
    const convertedDate = new Date(convertedDateStart);
    const finalConvertedDate = convertedDate.getUTCDay();
    const sunday = time - finalConvertedDate * 86400000;
    const monday = time - (finalConvertedDate - 1) * 86400000;
    const tuesday = time - (finalConvertedDate - 2) * 86400000;
    const wednesday = time - (finalConvertedDate - 3) * 86400000;
    const thursday = time - (finalConvertedDate - 4) * 86400000;
    const friday = time - (finalConvertedDate - 5) * 86400000;
    const saturday = time - (finalConvertedDate - 6) * 86400000;
    var daysObject = { };
    function addDayObject(timestamp) {
      daysObject[timestamp] = {
        round_date: timestamp,
        shifts: []
      };
    }
    const timeArray = [sunday, monday, tuesday, wednesday, thursday, friday, saturday];
    timeArray.map(round_date => {
      addDayObject(round_date);
    });
    return daysObject;
  }
  generateStartOfWeekTimestamp(time) {
    const convertedDate = createDateObjFromDateString(time);// converts unix time to date/at midnight
    const numericDay = convertedDate.getDay();
    const startDay = createDateObjFromDateString(time);// converts unix time to date/at midnight
    startDay.setDate(startDay.getDate() - numericDay);
    const startOfWeek = startDay.getTime();
    return adjustLocalTimestampToUTCSeconds(startOfWeek);
  }
  generateEndOfWeekTimestamp(time) {
    const convertedDate = createDateObjFromDateString(time);// converts unix time to date/at midnight
    const numericDay = convertedDate.getDay();
    const endDay = createDateObjFromDateString(time);// converts unix time to date/at midnight
    endDay.setDate(endDay.getDate() + 6 - numericDay);
    const endOfWeek = endDay.getTime();
    return adjustLocalTimestampToUTCSeconds(endOfWeek);
  }
  generateArrayOfFullWeek(weekData) {
    if (this.state.data === null) {
      return;
    }
    for (let shiftI = 0; shiftI < this.state.data.length; shiftI++) {
      let thisShift = this.state.data[shiftI];
      let fullTimestampFromShift = parseInt(adjustUTCSecondsToLocalTimestamp(thisShift.date));
      let shiftTimestamp = createDateObjFromDateString(fullTimestampFromShift).getTime();
      if (weekData[ shiftTimestamp] !== undefined) {
        weekData[ shiftTimestamp].shifts.push(thisShift);
      }
    }
    let weekDataArray = Object.values(weekData);
    console.log('weekDataArray:', weekDataArray);
    return weekDataArray;
  }
  getData(url, methodToUse) {
    fetch(url, { method: methodToUse })
      .then(response => { return response.json(); })
      .then(weekShiftInfo => {
        this.setState({
          data: weekShiftInfo
        });

      });
  }
  componentDidMount() {
    const startOfTheWeek = this.generateStartOfWeekTimestamp(this.props.defaultDate);
    const endOfTheWeek = this.generateEndOfWeekTimestamp(this.props.defaultDate);
    this.getData('/api/shifts-week.php?startDate=' + startOfTheWeek + '&endDate=' + endOfTheWeek + '&id=' + this.state.userId, 'GET');
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.date !== this.props.match.params.date) {
      const startOfTheWeek = this.generateStartOfWeekTimestamp(this.props.match.params.date);
      const endOfTheWeek = this.generateEndOfWeekTimestamp(this.props.match.params.date);
      this.getData('/api/shifts-week.php?startDate=' + startOfTheWeek + '&endDate=' + endOfTheWeek + '&id=' + this.state.userId, 'GET');
    }
  }
  render() {
    if (this.props.match.params.date === undefined) {
      var dateToPass = this.props.defaultDate;
    } else {
      dateToPass = createDateObjFromDateString(this.props.match.params.date);// converts unix time to date/at midnight
      console.log('date to pass before getTime: ', dateToPass);
      dateToPass = dateToPass.getTime();
      console.log('date to pass after getTime: ', dateToPass);
    }
    const weekArray = this.generateFullWeekOfTimestamps(dateToPass);
    const weekDayShiftArray = this.generateArrayOfFullWeek(weekArray);
    if (!this.state.data) {
      return <div>No Data Available</div>;
    }
    console.log('Week dateToPass: ', dateToPass);
    return (

      <React.Fragment>
        <TopMenuShift userId={this.props.userId} title="WEEK" page='week' date={dateToPass}/>

        <div className="masterContainerIphone">
          <div className="viewHoursContainer">
            <HoursOfOperation />
          </div>
          <div className="calendarContainerWeekComponent">
            {weekDayShiftArray.map((dayData, index) => {

              return (
                <ShiftsWeekDay key={index} dayData={dayData} shifts={dayData.shifts} defaultDay={this.props.defaultDate} date={dateToPass} />
              );
            })}
          </div>
        </div>

      </React.Fragment>
    );
  }
}

export default ShiftsWeek;
