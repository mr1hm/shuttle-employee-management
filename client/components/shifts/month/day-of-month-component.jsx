import React from 'react';
import './shifts-month.css';
import { createDateObjFromDateString, adjustUTCSecondsToLocalTimestamp } from '../../../lib/time-functions';

class DayOfMonth extends React.Component {
  renderDate() {
    if (this.props.shiftsArray.length !== 0) {
      let dayTypeClasses = {
        posted: false,
        scheduled: false
      };
      for (var shiftIndex = 0; shiftIndex < this.props.shiftsArray.length; shiftIndex++) {
        const shiftDate = this.props.shiftsArray[shiftIndex].date;
        // const shiftDateFullTimestamp = adjustUTCSecondsToLocalTimestamp(shiftDate);
        let baseDate = createDateObjFromDateString(parseInt(shiftDate) * 1000);// converts unix time to date/at midnight 09/17/2019
        if (baseDate.getTime() === this.props.dayObj.getTime()) {
          dayTypeClasses[this.props.shiftsArray[shiftIndex].status] = true;
        }
      }
      let postedClasses = 'monthDay rounded-circle mx-auto p-1';
      for (let key in dayTypeClasses) {
        postedClasses += dayTypeClasses[key] ? ` ${key}-shift-color` : '';
      }
      return (
        <div className={ postedClasses}>
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
