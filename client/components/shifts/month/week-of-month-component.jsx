import React from 'react';
import DayOfWeek from './day-of-week-component';

class WeekOfMonth extends React.Component {
  calculateSumOfHoursScheduledForWeek() {
    let sumOfHours = null;
    for (let i = 0; i < this.props.weeklyHours.length; i++) {
      sumOfHours += this.props.weeklyHours[i].hours;
    }
    return (
      sumOfHours.toFixed(0) + 'h ' +
            ((sumOfHours - sumOfHours.toFixed(0)) * 60).toFixed(0) + 'm'
    );
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-10 pr-0">
            <div style={{
              'border': '2px solid black'
            }}>
              {this.props.currentWeekArray.map(date =>
                <DayOfWeek
                  key={date}
                  dataFromWeekOfMonth={date}
                />
              )}
            </div>
          </div>
          <div className="col-2 pl-0">
            <div style={{
              'height': '16vmin',
              'border': '2px solid black'
            }}>{this.calculateSumOfHoursScheduledForWeek()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default WeekOfMonth;
