import React from 'react';
import WeekOfMonth from './week-component';
import MonthHeader from './month-header';

export default class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.bundleWeeks = this.bundleWeeks.bind(this);
    this.weeklyScheduledHours = [
      {
        id: 1,
        date: '2019-07-21',
        day: 'Sunday',
        hours: 0
      },
      {
        id: 2,
        date: '2019-07-22',
        day: 'Monday',
        hours: 5.75
      },
      {
        id: 3,
        date: '2019-07-23',
        day: 'Tuesday',
        hours: 5
      },
      {
        id: 4,
        date: '2019-07-24',
        day: 'Wednesday',
        hours: 0
      },
      {
        id: 5,
        date: '2019-07-25',
        day: 'Thursday',
        hours: 4.5
      },
      {
        id: 6,
        date: '2019-07-26',
        day: 'Friday',
        hours: 0
      },
      {
        id: 7,
        date: '2019-07-27',
        day: 'Saturday',
        hours: 0
      }
    ];
  }
  bundleWeeks() {
    const weekOutput = [];
    const numOfWeeks = 5;
    for (var weekIndex = 0; weekIndex < numOfWeeks; weekIndex++) {
      weekOutput.push(<WeekOfMonth key={this.weeklyScheduledHours.id} weeklyHours={this.weeklyScheduledHours} />);
    }
    return weekOutput;
  }
  render() {
    return (
      <div>
      <MonthHeader/>
      {this.bundleWeeks()}
      </div>
    )
  }
}
