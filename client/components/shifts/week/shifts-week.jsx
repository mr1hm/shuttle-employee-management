import React from 'react';
import './shifts-week.css';
import HoursOfOperationWeek from './hours-of-operation-week';
import ShiftsWeekDay from './shifts-week-day';
import TopMenuShift from '../../topmenu/topmenu-shift';
import {
  getDateString,
  adjustUTCSecondsToLocalTimestamp
} from '../../../lib/time-functions';

class ShiftsWeek extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      week: [],
      data: null,
      userId: this.props.userId
    };
  }
  initializeWeekData() {
    const dateObj = new Date(this.props.match.params.date);// converts unix time to date/at midnight
    const dayOffset = dateObj.getUTCDay();
    dateObj.setUTCDate(dateObj.getUTCDate() - dayOffset);
    var firstDayOfWeek = null;
    var lastDayOfWeek = null;
    const week = {};
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      let date = getDateString(dateObj);
      if (dayIndex === 0) {
        firstDayOfWeek = date;
      } else if (dayIndex === 6) {
        lastDayOfWeek = date;
      }
      week[date] = {
        round_date: date,
        shifts: []
      };
      dateObj.setUTCDate(dateObj.getUTCDate() + 1);
    }
    fetch(`/api/shifts-week.php?startDate=${firstDayOfWeek}&endDate=${lastDayOfWeek}&id=${this.props.userId}`)
      .then(response => response.json())
      .then(data => {
        let weekWithShifts = this.generateArrayOfFullWeek(week, data);
        console.log('week: ', weekWithShifts);
        console.log('data', data);
        this.setState({
          week: weekWithShifts,
          data: data
        });
      });
  }
  generateArrayOfFullWeek(weekObj, shifts) {
    for (let shiftI = 0; shiftI < shifts.length; shiftI++) {
      let shift = shifts[shiftI];
      let shiftDate = shift.date;
      if (weekObj[shiftDate] !== undefined) {
        weekObj[shiftDate].shifts.push(shift);
      }
    }
    let weekDataArray = Object.values(weekObj);
    console.log('weekDataArray:', weekDataArray);
    return weekDataArray;
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
    if (!this.state.data) {
      return <div>No Data Available</div>;
    }
    const week = this.state.week;
    return (
      <React.Fragment>
        <TopMenuShift userId={this.props.userId} title="WEEK" page='week' dateString={this.props.match.params.date} />
        <div className="mainContainerWeek d-flex flex-column">
          <div className="weeksContainer px-5">
            <HoursOfOperationWeek />
            {week.map((dayData, index) => {
              return (
                <ShiftsWeekDay key={index} dayData={dayData} shifts={dayData.shifts} />
              );
            })}
          </div>
        </div>

      </React.Fragment>
    );
  }
}

export default ShiftsWeek;
