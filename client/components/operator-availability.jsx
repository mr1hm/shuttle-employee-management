import React from 'react';
import TopMenuGeneral from './topmenu/topmenu-general';
import './operator-availability.css';
import SelectAvailabilityModal from './operator-availability-modal';
import ErrorModal from './operator-error-modal';
import ClearDayModal from './operator-clear-day-modal';

// dummy data only right now (not connected to endpoint)
class OperatorAvailability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availability: {
        'Sunday': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Monday': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Tuesday': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Wednesday': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Thursday': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Friday': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Saturday': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      show: false,
      clear: false,
      day: null,
      error: false,
      selectedStartTime: 0,
      selectedEndTime: 0,
      // eventually this needs to be passed by props
      userId: 45,
      sessionId: 1
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.hideErrorModal = this.hideErrorModal.bind(this);
    this.showError = this.showError.bind(this);
    this.setStartTime = this.setStartTime.bind(this);
    this.setEndTime = this.setEndTime.bind(this);
    this.showClearModal = this.showClearModal.bind(this);
    this.hideClearModal = this.hideClearModal.bind(this);
    this.cancelClearModal = this.cancelClearModal.bind(this);
    this.updateDatabase = this.updateDatabase.bind(this);
  }

  buildDayCell(day) {
    return (
      this.state.availability[day].map((element, index) => {
        if (element) {
          return <td key={index} style={{ backgroundColor: 'green', width: '1.35%', height: '10vh', border: '1px solid black' }}></td>;
        } else {
          return <td key={index} style={{ backgroundColor: 'initial', width: '1.35%', height: '10vh', border: '1px solid black' }}></td>;
        }
      })
    );
  }

  // updating the db with the availability
  updateDatabase() {
    fetch('/api/operator-availability.php', {
      method: 'POST',
      body: JSON.stringify({
        'user_id': this.state.userId,
        'availability': this.state.availability,
        'session_id': this.state.sessionId
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .catch(error => { throw (error); });
  }

  buildHeaderTimes() {
    const headerTimes = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];

    return (
      headerTimes.map((element, index) => {
        return <th key={index} style={{ width: '5.4%', height: '5vh', border: '1px solid black' }}>{element}</th>;
      })
    );
  }

  showModal(event) {
    this.setState({
      show: true,
      day: event.currentTarget.id
    });

  }

  hideModal() {
    this.setState({
      show: false
    });

    const timeIndex = { '6:00 am': 0, '6:15 am': 1, '6:30 am': 2, '6:45 am': 3, '7:00 am': 4, '7:15 am': 5, '7:30 am': 6, '7:45 am': 7, '8:00 am': 8, '8:15 am': 9, '8:30 am': 10, '8:45 am': 11, '9:00 am': 12, '9:15 am': 13, '9:30 am': 14, '9:45 am': 15, '10:00 am': 16, '10:15 am': 17, '10:30 am': 18, '10:45 am': 19, '11:00 am': 20, '11:15 am': 21, '11:30 am': 22, '11:45 am': 23, '12:00 pm': 24, '12:15 pm': 25, '12:30 pm': 26, '12:45 pm': 27, '1:00 pm': 28, '1:15 pm': 29, '1:30 pm': 30, '1:45 pm': 31, '2:00 pm': 32, '2:15 pm': 33, '2:30 pm': 34, '2:45 pm': 35, '3:00 pm': 36, '3:15 pm': 37, '3:30 pm': 38, '3:45 pm': 39, '4:00 pm': 40, '4:15 pm': 41, '4:30 pm': 42, '4:45 pm': 43, '5:00 pm': 44, '5:15 pm': 45, '5:30 pm': 46, '5:45 pm': 47, '6:00 pm': 48, '6:15 pm': 49, '6:30 pm': 50, '6:45 pm': 51, '7:00 pm': 52, '7:15 pm': 53, '7:30 pm': 54, '7:45 pm': 55, '8:00 pm': 56, '8:15 pm': 57, '8:30 pm': 58, '8:45 pm': 59, '9:00 pm': 60, '9:15 pm': 61, '9:30 pm': 62, '9:45 pm': 63, '10:00 pm': 64, '10:15 pm': 65, '10:30 pm': 66, '10:45 pm': 67, '11:00 pm': 68, '11:15 pm': 69, '11:30 pm': 70, '11:45 pm': 71, '12:00 am': 72 };

    const startIndex = timeIndex[this.state.selectedStartTime];
    const endIndex = timeIndex[this.state.selectedEndTime];

    if (startIndex > endIndex || startIndex === endIndex || endIndex - startIndex < 6) {
      console.log('inside error');
      this.showError();
    } else {
      var availabilityObject = Object.assign({}, this.state.availability);
      var availabilityDay = availabilityObject[this.state.day].map((cell, index) => {
        if (index >= startIndex && index < endIndex) {
          return 1;
        } if (cell === 1) {
          return 1;
        } else {
          return 0;
        }
      });
      availabilityObject[this.state.day] = availabilityDay;
      this.setState({
        availability: availabilityObject,
        selectedStartTime: 0,
        selectedEndTime: 0
      });

    }
  }

  showError() {
    this.setState({
      error: true
    });

  }
  hideErrorModal() {
    this.setState({
      error: false,
      selectedStartTime: 0,
      selectedEndTime: 0
    });
  }

  showClearModal(event) {
    this.setState({
      clear: true,
      day: event.currentTarget.id
    });
  }

  hideClearModal() {
    var day = this.state.day;
    var availabilityObject = Object.assign({}, this.state.availability);
    var availabilityDay = availabilityObject[day].map(cell => 0);
    availabilityObject[day] = availabilityDay;

    this.setState({
      availability: availabilityObject,
      clear: false,
      selectedStartTime: 0,
      selectedEndTime: 0
    });
  }

  cancelClearModal() {
    this.setState({
      clear: false
    });
  }

  setStartTime(event) {
    this.setState({
      selectedStartTime: event.currentTarget.textContent
    });
  }

  setEndTime(event) {
    this.setState({
      selectedEndTime: event.currentTarget.textContent
    });
  }

  render() {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const times = ['6:00 am', '6:15 am', '6:30 am', '6:45 am', '7:00 am', '7:15 am', '7:30 am', '7:45 am', '8:00 am', '8:15 am', '8:30 am', '8:45 am', '9:00 am', '9:15 am', '9:30 am', '9:45 am', '10:00 am', '10:15 am', '10:30 am', '10:45 am', '11:00 am', '11:15 am', '11:30 am', '11:45 am', '12:00 pm', '12:15 pm', '12:30 pm', '12:45 pm', '1:00 pm', '1:15 pm', '1:30 pm', '1:45 pm', '2:00 pm', '2:15 pm', '2:30 pm', '2:45 pm', '3:00 pm', '3:15 pm', '3:30 pm', '3:45 pm', '4:00 pm', '4:15 pm', '4:30 pm', '4:45 pm', '5:00 pm', '5:15 pm', '5:30 pm', '5:45 pm', '6:00 pm', '6:15 pm', '6:30 pm', '6:45 pm', '7:00 pm', '7:15 pm', '7:30 pm', '7:45 pm', '8:00 pm', '8:15 pm', '8:30 pm', '8:45 pm', '9:00 pm', '9:15 pm', '9:30 pm', '9:45 pm', '10:00 pm', '10:15 pm', '10:30 pm', '10:45 pm', '11:00 pm', '11:15 pm', '11:30 pm', '11:45 pm', '12:00 am'];
    return (
      <React.Fragment>
        <TopMenuGeneral title="MY AVAILABILITY"/>
        <div className="d-flex flex-row-reverse">
          <div style={{ width: '5%' }}></div>
          <button className=" btn btn-primary mt-3" onClick={this.updateDatabase}>Submit Availability</button>
          <div style={{ width: '5%' }}></div>
        </div>
        <div className="d-flex">
          <div style={{ width: '5%' }}></div>
          <table className="mt-4 mr-0" style={{ width: '90%' }}>
            <thead className="container">
              <tr className="row d-flex justify-content-end">
                <th style={{ width: '2.8%', height: '5vh', border: '1px solid black' }}>Day</th>
                {this.buildHeaderTimes()}
              </tr>
            </thead>
            <tbody className="container">
              {
                weekdays.map(day => {
                  return (
                    <tr key={day} className="row d-flex justify-content-end">
                      <td className="align-middle" style={{ backgroundColor: 'white', width: '2.8%', heigth: '10vh', border: '1px solid black', fontWeight: 'bold' }}>
                        {day.slice(0, 3)}
                        <button id={day} onClick={this.showModal} className="p-0 m-0 btn btn-success" type="button">Add</button>
                        <button id={day} onClick={this.showClearModal} className="p-0 mt-1 btn btn-danger" type="button">Clear</button>
                      </td>
                      {this.buildDayCell(day)}
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
          <div style={{ width: '5%' }}></div>
        </div>
        <SelectAvailabilityModal day={this.state.day} show={this.state.show} close={this.hideModal}>
          <div className="d-flex">
            <div className="mr-2">
              <div className="m-2 border" id="startTime">{this.state.selectedStartTime}</div>
              <div className="dropdown mb-2">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                StartTime
                </button>
                <div className="dropdown-menu scrollable-menu" aria-labelledby="dropdownMenu2">
                  {
                    times.map(time => {
                      return (
                        <button key={time} className="dropdown-item" onClick={this.setStartTime} type="button">{time}</button>
                      );
                    })
                  }
                </div>
              </div>
            </div>

            <div className="ml-2">
              <div className="m-2 border" id="endTime">{this.state.selectedEndTime}</div>
              <div className="dropdown mb-2">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                End Time
                </button>
                <div className="dropdown-menu scrollable-menu" aria-labelledby="dropdownMenu2">
                  {
                    times.map(time => {
                      return (
                        <button key={time} className="dropdown-item" onClick={this.setEndTime} type="button">{time}</button>
                      );
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </SelectAvailabilityModal>

        <ErrorModal day={this.state.day} errorShow={this.state.error} closeError={this.hideErrorModal}>
          <div className="d-flex justify-content-center">
            <p className='mt-3 mb-2 ml-3 mr-3 text-align-center'>The end time must be at least 1 hr 30 min after the start time</p>
          </div>
        </ErrorModal>

        <ClearDayModal day={this.state.day} clearShow={this.state.clear} closeClear={this.hideClearModal} cancelClear={this.cancelClearModal}>
          <div className="d-flex justify-content-center">
            <p className='mt-3 mb-2 ml-3 mr-3 text-align-center'>Are you sure you want to clear all the availables times for this day?</p>
          </div>
        </ClearDayModal>

      </React.Fragment>
    );
  }
}

export default OperatorAvailability;
