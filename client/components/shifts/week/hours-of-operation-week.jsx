import React from 'react';
class HoursOfOperationWeek extends React.Component {
  hoursLabelRow() {
    const hoursArray = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
    return hoursArray.map((time, index) =>
      <div className="weekScheduleHour flex-fill" key={index} >
        {time}
      </div>
    );
  }
  render() {
    return (
      <div className="hoursRow w-100 d-flex justify-content-between">
        <div className="hoursWeekEmpty"></div>
        {this.hoursLabelRow()}
      </div>
    );
  }
}
export default HoursOfOperationWeek;
