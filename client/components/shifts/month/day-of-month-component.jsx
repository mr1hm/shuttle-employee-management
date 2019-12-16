import React from 'react';
import './shifts-month.css';
import { getDateString } from '../../../lib/time-functions';

class DayOfMonth extends React.Component {
  renderDate() {
    if (!this.props.dayIndex) {
      return (
        <div className="monthDay rounded-circle mx-auto p-1">
          {this.props.dayIndex}
        </div>
      );
    }
    if (this.props.shiftsArray.length !== 0) {
      let dayTypeClasses = {
        posted: false,
        scheduled: false
      };
      for (var shiftIndex = 0; shiftIndex < this.props.shiftsArray.length; shiftIndex++) {
        const shiftDateString = this.props.shiftsArray[shiftIndex].date;
        const thisDayDateString = getDateString(this.props.dayObj);
        if (shiftDateString === thisDayDateString) {
          dayTypeClasses[this.props.shiftsArray[shiftIndex].status] = true;
        }
      }
      let postedClasses = 'monthDay rounded-circle mx-auto p-1';
      for (let key in dayTypeClasses) {
        postedClasses += dayTypeClasses[key] ? ` ${key}-shift-color` : '';
      }
      return (
        <div class={ postedClasses}>
          {this.props.dayIndex}
        </div>
      );
    }
    return (
      <div className="monthDay rounded-circle mx-auto p-1">
        {this.props.dayIndex}
      </div>
    );
  }
  render() {
    return this.renderDate();
  }
}

export default DayOfMonth;
