import React from 'react'
class HoursOfOperation extends React.Component {
  hoursLabelRow() {
    const hoursArray = [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return hoursArray.map((time, index) =>
      <div className="calendarHour" key= {index} >
        {time}
      </div>
    );
  }
  render() {
    return (
      <div className="hoursRow w-100 d-flex justify-content-between">
        {this.hoursLabelRow()}
      </div>
    );
  }
}
export default HoursOfOperation;
