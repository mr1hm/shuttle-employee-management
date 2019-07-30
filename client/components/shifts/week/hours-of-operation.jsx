import React from 'react'
class HoursOfOperation extends React.Component {
  hoursLabelRow() {
    const hoursArray = [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return hoursArray.map(time =>
      <div className="calendarHour">
        {time}
      </div>
    );
  }
  render() {
    return (
      <div className="hoursRow">
        {this.hoursLabelRow()}
      </div>
    );
  }
}
export default HoursOfOperation;
