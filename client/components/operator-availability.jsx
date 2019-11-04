import React from 'react';
import TopMenuGeneral from './topmenu/topmenu-general';
import './operator-availability.css';
import SelectAvailabilityModal from './operator-availability-modal';
import ErrorModal from './operator-error-modal';
import SubmitModal from './operator-submit-modal';

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
      submit: false,
      day: null,
      error: false,
      selectedStartTime: null,
      selectedEndTime: null,
      // eventually this needs to be passed by props
      userId: 45,
      sessionId: 1
    };

    this.timeIndex = { '6:00 am': 0, '6:15 am': 1, '6:30 am': 2, '6:45 am': 3, '7:00 am': 4, '7:15 am': 5, '7:30 am': 6, '7:45 am': 7, '8:00 am': 8, '8:15 am': 9, '8:30 am': 10, '8:45 am': 11, '9:00 am': 12, '9:15 am': 13, '9:30 am': 14, '9:45 am': 15, '10:00 am': 16, '10:15 am': 17, '10:30 am': 18, '10:45 am': 19, '11:00 am': 20, '11:15 am': 21, '11:30 am': 22, '11:45 am': 23, '12:00 pm': 24, '12:15 pm': 25, '12:30 pm': 26, '12:45 pm': 27, '1:00 pm': 28, '1:15 pm': 29, '1:30 pm': 30, '1:45 pm': 31, '2:00 pm': 32, '2:15 pm': 33, '2:30 pm': 34, '2:45 pm': 35, '3:00 pm': 36, '3:15 pm': 37, '3:30 pm': 38, '3:45 pm': 39, '4:00 pm': 40, '4:15 pm': 41, '4:30 pm': 42, '4:45 pm': 43, '5:00 pm': 44, '5:15 pm': 45, '5:30 pm': 46, '5:45 pm': 47, '6:00 pm': 48, '6:15 pm': 49, '6:30 pm': 50, '6:45 pm': 51, '7:00 pm': 52, '7:15 pm': 53, '7:30 pm': 54, '7:45 pm': 55, '8:00 pm': 56, '8:15 pm': 57, '8:30 pm': 58, '8:45 pm': 59, '9:00 pm': 60, '9:15 pm': 61, '9:30 pm': 62, '9:45 pm': 63, '10:00 pm': 64, '10:15 pm': 65, '10:30 pm': 66, '10:45 pm': 67, '11:00 pm': 68, '11:15 pm': 69, '11:30 pm': 70, '11:45 pm': 71, '12:00 am': 72 };

    this.times = ['6:00 am', '6:15 am', '6:30 am', '6:45 am', '7:00 am', '7:15 am', '7:30 am', '7:45 am', '8:00 am', '8:15 am', '8:30 am', '8:45 am', '9:00 am', '9:15 am', '9:30 am', '9:45 am', '10:00 am', '10:15 am', '10:30 am', '10:45 am', '11:00 am', '11:15 am', '11:30 am', '11:45 am', '12:00 pm', '12:15 pm', '12:30 pm', '12:45 pm', '1:00 pm', '1:15 pm', '1:30 pm', '1:45 pm', '2:00 pm', '2:15 pm', '2:30 pm', '2:45 pm', '3:00 pm', '3:15 pm', '3:30 pm', '3:45 pm', '4:00 pm', '4:15 pm', '4:30 pm', '4:45 pm', '5:00 pm', '5:15 pm', '5:30 pm', '5:45 pm', '6:00 pm', '6:15 pm', '6:30 pm', '6:45 pm', '7:00 pm', '7:15 pm', '7:30 pm', '7:45 pm', '8:00 pm', '8:15 pm', '8:30 pm', '8:45 pm', '9:00 pm', '9:15 pm', '9:30 pm', '9:45 pm', '10:00 pm', '10:15 pm', '10:30 pm', '10:45 pm', '11:00 pm', '11:15 pm', '11:30 pm', '11:45 pm', '12:00 am'];

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.hideErrorModal = this.hideErrorModal.bind(this);
    this.showError = this.showError.bind(this);
    this.setStartTime = this.setStartTime.bind(this);
    this.setEndTime = this.setEndTime.bind(this);
    this.updateDatabase = this.updateDatabase.bind(this);
    this.showSubmitModal = this.showSubmitModal.bind(this);
    this.handleSubmitModal = this.handleSubmitModal.bind(this);
    this.cancelSubmitModal = this.cancelSubmitModal.bind(this);
    this.getShiftInfo = this.getShiftInfo.bind(this);
    this.deleteShift = this.deleteShift.bind(this);
  }

  buildDayCell(day) {
    const defaultStyles = {
      width: '1.35%',
      height: '9vh',
      borderBottom: '1px solid black'
    };

    // cleanup the remaining lines to match what was done on line 62
    return (
      this.state.availability[day].map((isSelected, index) => {
        const isPM = index >= 24;
        const isFirst15Minutes = index % 4 === 0;
        const isFinal15Minutes = index === 71;
        const style = {
          backgroundColor: undefined,
          borderRight: undefined,
          borderLeft: undefined
        };
        if (isPM) style.backgroundColor = 'lightGrey';
        if (isSelected) style.backgroundColor = 'green';
        if (isFirst15Minutes) style.borderLeft = '1px solid black';
        if (isFinal15Minutes) style.borderRight = '1px solid black';
        return <td key={index} id={index} className={day} onClick={this.getShiftInfo} style={{ ...defaultStyles, ...style }} />;
      })
    );
  }

  buildHeaderTimes() {
    let defaultStyles = {
      width: '1.35%',
      height: '8vh',
      borderTop: '1px solid black',
      borderBottom: '1px solid black'
    };

    const headerTimes = ['6', '', '', '', '7', '', '', '', '8', '', '', '', '9', '', '', '', '10', '', '', '', '11', '', '', '', '12', '', '', '', '1', '', '', '', '2', '', '', '', '3', '', '', '', '4', '', '', '', '5', '', '', '', '6', '', '', '', '7', '', '', '', '8', '', '', '', '9', '', '', '', '10', '', '', '', '11', '', '', ''];

    return (
      headerTimes.map((element, index) => {
        if (index < 24) {
          if (index % 4 === 0) {
            return <th key={index} style={{ ...defaultStyles, borderLeft: '1px solid black' }} className="d-flex align-items-center pb-2">{element}</th>;
          } else {
            return <th key={index} style={{ ...defaultStyles }} className="d-flex align-items-center pb-2">{element}</th>;
          }
        } else {
          if (index === 71) {
            return <th key={index} style={{ ...defaultStyles, borderRight: '1px solid black' }} className="d-flex align-items-center pb-2">{element}</th>;
          } if (index % 4 === 0) {
            return <th key={index} style={{ ...defaultStyles, borderLeft: '1px solid black' }} className="d-flex align-items-center pb-2">{element}</th>;
          } else {
            return <th key={index} style={{ ...defaultStyles }} className="d-flex align-items-center pb-2">{element}</th>;
          }
        }
      })
    );
  }

  cancelSubmitModal() {
    this.setState({
      submit: false
    });
  }

  deleteShift() {
    var day = this.state.day;
    var selStartTime = this.state.selectedStartTime;
    var selEndTime = this.state.selectedEndTime;
    var availabilityObject = Object.assign({}, this.state.availability);
    var availabilityDay = availabilityObject[day].map((element, index) => {
      if (index >= this.timeIndex[selStartTime] && index <= this.timeIndex[selEndTime]) {
        return 0;
      } else {
        return element;
      }
    });
    availabilityObject[day] = availabilityDay;

    this.setState({
      availability: availabilityObject,
      show: false,
      selectedStartTime: null,
      selectedEndTime: null
    });
  }

  findShift(clickedIndex, day) {
    var length = this.state.availability[day].length;

    if (this.state.availability[day][clickedIndex]) {
      for (var index = clickedIndex; index >= 0; index--) {
        if (index === 0 && this.state.availability[day][index] === 1) {
          this.setState({
            selectedStartTime: '6:00 am'
          });
          break;
        } if (this.state.availability[day][index] === 0) {
          var startIndex = index + 1;
          this.setState({
            selectedStartTime: this.times[startIndex]
          });
          break;
        }
      }

      for (var index1 = clickedIndex; index1 < length; index1++) {
        if (index1 === length - 1 && this.state.availability[day][index1] === 1) {
          this.setState({
            selectedEndTime: '12:00 am'
          });
          break;
        } if (this.state.availability[day][index1] === 0) {
          var endIndex = index1;
          this.setState({
            selectedEndTime: this.times[endIndex]
          });
          break;
        }
      }
    } else {
      this.setState({
        selectedStartTime: this.times[clickedIndex]
      });
    }
  }

  getShiftInfo(event) {
    var clickedIndex = event.currentTarget.id;
    var day = event.currentTarget.className;
    this.findShift(clickedIndex, day);
    this.setState({
      show: true,
      day: day
    });
  }

  handleSubmitModal() {
    this.updateDatabase();
    this.setState({
      submit: false
    });
  }

  hideErrorModal() {
    this.setState({
      error: false,
      selectedStartTime: 0,
      selectedEndTime: 0
    });
  }

  hideModal() {
    this.setState({
      show: false
    });
    const startIndex = this.timeIndex[this.state.selectedStartTime];
    const endIndex = this.timeIndex[this.state.selectedEndTime];

    if (startIndex > endIndex || startIndex === endIndex || endIndex - startIndex < 6) {
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
        selectedStartTime: null,
        selectedEndTime: null
      });

    }
  }

  setEndTime(event) {
    var storedEndTimeIndex = this.timeIndex[this.state.selectedEndTime];
    var incomingEndTimeIndex = this.timeIndex[event.currentTarget.textContent];
    var availabilityObject = Object.assign({}, this.state.availability);

    if (storedEndTimeIndex) {
      if (storedEndTimeIndex > incomingEndTimeIndex) {
        var availabilityDay = availabilityObject[this.state.day].map((cell, index) => {
          if (index <= storedEndTimeIndex && index >= incomingEndTimeIndex) {
            return 0;
          } if (cell === 1) {
            return 1;
          } else {
            return 0;
          }
        });
        availabilityObject[this.state.day] = availabilityDay;

        this.setState({
          availability: availabilityObject,
          selectedEndTime: event.currentTarget.textContent
        });
      }
    }
    this.setState({
      selectedEndTime: event.currentTarget.textContent
    });
  }

  setStartTime(event) {
    var storedStartTimeIndex = this.timeIndex[this.state.selectedStartTime];
    var incomingStartTimeIndex = this.timeIndex[event.currentTarget.textContent];
    var availabilityObject = Object.assign({}, this.state.availability);

    if (storedStartTimeIndex >= 0) {
      if (storedStartTimeIndex < incomingStartTimeIndex) {
        var availabilityDay = availabilityObject[this.state.day].map((cell, index) => {
          if (index >= storedStartTimeIndex && index < incomingStartTimeIndex) {
            return 0;
          } if (cell === 1) {
            return 1;
          } else {
            return 0;
          }
        });
        availabilityObject[this.state.day] = availabilityDay;

        this.setState({
          availability: availabilityObject,
          selectedStartTime: event.currentTarget.textContent
        });
      }
    }
    this.setState({
      selectedStartTime: event.currentTarget.textContent
    });
  }

  showError() {
    this.setState({
      error: true
    });

  }

  showSubmitModal() {
    this.setState({
      submit: true
    });
  }

  showModal(event) {
    this.setState({
      show: true,
      day: event.currentTarget.id
    });
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

  render() {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
      <React.Fragment>
        <TopMenuGeneral title="MY AVAILABILITY"/>
        <div className="d-flex justify-content-between">
          <div className='mb-0 ml-3'>Click day and approximate time to add, change, or delete.</div>
          <button type="button" className="btn btn-primary btn-sm mr-4" onClick={this.showSubmitModal}>Submit Availability</button>
        </div>
        <div className="d-flex">
          <div style={{ width: '5%' }}></div>
          <table className="mt-2 mr-0" style={{ width: '90%' }}>
            <thead className="container">
              <tr className="row d-flex justify-content-end">
                <th style={{ width: '2.8%', height: '8vh', borderLeft: '1px solid black', borderBottom: '1px solid black', borderTop: '1px solid black' }}></th>
                {this.buildHeaderTimes()}
              </tr>
            </thead>
            <tbody className="container">
              {
                weekdays.map(day => {
                  return (
                    <tr key={day} className="row d-flex justify-content-end">
                      <td className="d-flex align-items-center justify-content-center" style={{ backgroundColor: 'initial', width: '2.8%', heigth: '9vh', borderLeft: '1px solid black', borderBottom: '1px solid black', fontWeight: 'bold' }}>
                        {day.slice(0, 1)}
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
        <SelectAvailabilityModal day={this.state.day} show={this.state.show} close={this.hideModal} deleteShift={this.deleteShift}>
          <div className="d-flex">
            <div className="mr-2">
              <div className="number m-2 border" id="startTime">{this.state.selectedStartTime}</div>
              <div className="dropdown mb-2">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                StartTime
                </button>
                <div className="dropdown-menu scrollable-menu" aria-labelledby="dropdownMenu2">
                  {
                    this.times.map(time => {
                      return (
                        <button key={time} className="dropdown-item" onClick={this.setStartTime} type="button">{time}</button>
                      );
                    })
                  }
                </div>
              </div>
            </div>

            <div className="ml-2">
              <div className="number m-2 border" id="endTime">{this.state.selectedEndTime}</div>
              <div className="dropdown mb-2">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                End Time
                </button>
                <div className="dropdown-menu scrollable-menu" aria-labelledby="dropdownMenu2">
                  {
                    this.times.map(time => {
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

        <SubmitModal day={this.state.day} submitShow={this.state.submit} submitAndClose={this.handleSubmitModal} submitCancel={this.cancelSubmitModal}>
          <div className="d-flex justify-content-center">
            <p className='mt-3 mb-2 ml-3 mr-3 text-align-center'>Are you sure you want to submit your available times?</p>
          </div>
        </SubmitModal>

      </React.Fragment>
    );
  }
}

export default OperatorAvailability;
