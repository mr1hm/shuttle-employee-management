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
      week: null,
      data: null,
      userId: this.props.userId
    };
  }
  initializeWeekData() {
    const dayOfWeek = new Date(this.props.match.params.date);// converts unix time to date/at midnight
    const dayOfWeekTimestamp = dayOfWeek.getTime();
    const dayOffset = dayOfWeek.getUTCDay();
    var startOfWeekTimestamp = null;
    var endOfWeekTimestamp = null;
    const daysObject = { };
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      let timestamp = dayOfWeekTimestamp - (dayOffset - dayIndex) * 86400000;
      if (dayIndex === 0) {
        startOfWeekTimestamp = adjustLocalTimestampToUTCSeconds(timestamp);
      } else if (dayIndex === 6) {
        endOfWeekTimestamp = adjustLocalTimestampToUTCSeconds(timestamp);
      }
      daysObject[timestamp] = {
        round_date: timestamp,
        shifts: []
      };
    }
    console.log('daysObject: ', daysObject);
    this.getData(`/api/shifts-week.php?startDate=${startOfWeekTimestamp}&endDate=${endOfWeekTimestamp}&id=${this.state.userId}`, 'GET');
    this.setState({
      week: daysObject
    });
  }
  generateArrayOfFullWeek(weekData) {
    if (this.state.data === null) {
      return;
    }
    for (let shiftI = 0; shiftI < this.state.data.length; shiftI++) {
      let thisShift = this.state.data[shiftI];
      let fullTimestampFromShift = parseInt(adjustUTCSecondsToLocalTimestamp(thisShift.date));
      if (weekData[fullTimestampFromShift] !== undefined) {
        weekData[fullTimestampFromShift].shifts.push(thisShift);
      }
    }
    let weekDataArray = Object.values(weekData);
    console.log('weekDataArray:', weekDataArray);
    return weekDataArray;
  }
  getData(url, methodToUse) {
    fetch(url, { method: methodToUse })
      .then(response => response.json())
      .then(weekData => {
        this.setState({
          data: weekData
        });
        console.log('weekData: ', weekData);
      });
  }
  componentDidMount() {
    this.initializeWeekData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.date !== this.props.match.params.date) {
      this.initializeWeekData();
    }
  }
  render() {
    const weekArray = this.state.week;
    const weekDayShiftArray = this.generateArrayOfFullWeek(weekArray);
    if (!this.state.data) {
      return <div>No Data Available</div>;
    }
    return (
      <React.Fragment>
        <TopMenuShift userId={this.props.userId} title="WEEK" page='week' dateString={this.props.match.params.date} />
        <div className="mainContainer d-flex flex-column">
          <div className="hoursContainer container">
            <HoursOfOperation />
          </div>
          <div className="weeksContainer px-5">
            {weekDayShiftArray.map((dayData, index) => {
              return (
                <ShiftsWeekDay key={index} dayData={dayData} shifts={dayData.shifts} defaultDay={this.props.defaultDate} />
              );
            })}
          </div>
        </div>

      </React.Fragment>
    );
  }
}

export default ShiftsWeek;
