import React from 'react';
import DayOfMonth from './day-component';

export default class WeekOfMonth extends React.Component {
  totalWeekHours() {
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
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-10 pr-0">
              <div style={{
                'border': '2px solid black'
              }}>
                {this.props.weeklyHours.map(dayScheduleObj =>
                  <DayOfMonth
                    key={dayScheduleObj.date}
                    dataFromWeekPrototype={dayScheduleObj}
                  />
                )}
              </div>
            </div>
            <div className="col-2 pl-0">
              <div style={{
                'height': '16vmin',
                'border': '2px solid black'
              }}>{this.totalWeekHours()}</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
 
