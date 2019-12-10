import React from 'react';
import TopMenuGeneral from './topmenu/topmenu-general';
import './operator-availability.css';
import SelectAvailabilityModal from './operator-availability-modal';
import ErrorModal from './operator-error-modal';
import SubmitModal from './operator-submit-modal';
import SelectSessionModal from './admin-select-session-modal';
import { getDateString } from '../lib/time-functions';

class OperatorAvailability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availability: {
        'Sunday': new Array(72).fill(0),
        'Monday': new Array(72).fill(0),
        'Tuesday': new Array(72).fill(0),
        'Wednesday': new Array(72).fill(0),
        'Thursday': new Array(72).fill(0),
        'Friday': new Array(72).fill(0),
        'Saturday': new Array(72).fill(0)
      },
      sessionChoices: [],
      availabilityInfo: null,
      minimumAvailability: null,
      role: '',
      show: false,
      clear: false,
      submit: false,
      selectSession: false,
      day: null,
      error: false,
      selectedStartTime: null,
      selectedEndTime: null,
      comment: '',
      // this will eventually come in through props with auth system
      userId: 9,
      sessionId: '',
      sessionName: ''
    };

    this.timeIndex = {}; // { '6:00 am': 0, '6:15 am': 1, '6:30 am': 2, '6:45 am': 3, '7:00 am': 4, '7:15 am': 5, '7:30 am': 6, '7:45 am': 7, '8:00 am': 8, '8:15 am': 9, '8:30 am': 10, '8:45 am': 11, '9:00 am': 12, '9:15 am': 13, '9:30 am': 14, '9:45 am': 15, '10:00 am': 16, '10:15 am': 17, '10:30 am': 18, '10:45 am': 19, '11:00 am': 20, '11:15 am': 21, '11:30 am': 22, '11:45 am': 23, '12:00 pm': 24, '12:15 pm': 25, '12:30 pm': 26, '12:45 pm': 27, '1:00 pm': 28, '1:15 pm': 29, '1:30 pm': 30, '1:45 pm': 31, '2:00 pm': 32, '2:15 pm': 33, '2:30 pm': 34, '2:45 pm': 35, '3:00 pm': 36, '3:15 pm': 37, '3:30 pm': 38, '3:45 pm': 39, '4:00 pm': 40, '4:15 pm': 41, '4:30 pm': 42, '4:45 pm': 43, '5:00 pm': 44, '5:15 pm': 45, '5:30 pm': 46, '5:45 pm': 47, '6:00 pm': 48, '6:15 pm': 49, '6:30 pm': 50, '6:45 pm': 51, '7:00 pm': 52, '7:15 pm': 53, '7:30 pm': 54, '7:45 pm': 55, '8:00 pm': 56, '8:15 pm': 57, '8:30 pm': 58, '8:45 pm': 59, '9:00 pm': 60, '9:15 pm': 61, '9:30 pm': 62, '9:45 pm': 63, '10:00 pm': 64, '10:15 pm': 65, '10:30 pm': 66, '10:45 pm': 67, '11:00 pm': 68, '11:15 pm': 69, '11:30 pm': 70, '11:45 pm': 71, '12:00 am': 72 };

    this.times = ['6:00 am', '6:15 am', '6:30 am', '6:45 am', '7:00 am', '7:15 am', '7:30 am', '7:45 am', '8:00 am', '8:15 am', '8:30 am', '8:45 am', '9:00 am', '9:15 am', '9:30 am', '9:45 am', '10:00 am', '10:15 am', '10:30 am', '10:45 am', '11:00 am', '11:15 am', '11:30 am', '11:45 am', '12:00 pm', '12:15 pm', '12:30 pm', '12:45 pm', '1:00 pm', '1:15 pm', '1:30 pm', '1:45 pm', '2:00 pm', '2:15 pm', '2:30 pm', '2:45 pm', '3:00 pm', '3:15 pm', '3:30 pm', '3:45 pm', '4:00 pm', '4:15 pm', '4:30 pm', '4:45 pm', '5:00 pm', '5:15 pm', '5:30 pm', '5:45 pm', '6:00 pm', '6:15 pm', '6:30 pm', '6:45 pm', '7:00 pm', '7:15 pm', '7:30 pm', '7:45 pm', '8:00 pm', '8:15 pm', '8:30 pm', '8:45 pm', '9:00 pm', '9:15 pm', '9:30 pm', '9:45 pm', '10:00 pm', '10:15 pm', '10:30 pm', '10:45 pm', '11:00 pm', '11:15 pm', '11:30 pm', '11:45 pm', '12:00 am'];

    this.times.forEach((t, i) => { this.timeIndex[t] = i; });

    this.hideShiftModal = this.hideShiftModal.bind(this);
    this.showShiftModal = this.showShiftModal.bind(this);

    this.hideErrorModal = this.hideErrorModal.bind(this);
    this.showErrorModal = this.showErrorModal.bind(this);

    this.cancelSubmitModal = this.cancelSubmitModal.bind(this);
    this.handleSubmitModal = this.handleSubmitModal.bind(this);
    this.showSubmitModal = this.showSubmitModal.bind(this);
    this.showSelectSessionModal = this.showSelectSessionModal.bind(this);
    this.closeSelectSessionModal = this.closeSelectSessionModal.bind(this);

    this.getEnteredAvailability = this.getEnteredAvailability.bind(this);
    this.getAvailabilityInfo = this.getAvailabilityInfo.bind(this);
    this.getEnteredAvailabilityToStart = this.getEnteredAvailabilityToStart.bind(this);
    this.getAvailabilityInfoToStart = this.getAvailabilityInfoToStart.bind(this);

    this.handleFormEntry = this.handleFormEntry.bind(this);
    this.handleCommentEntry = this.handleCommentEntry.bind(this);

    this.setStartTime = this.setStartTime.bind(this);
    this.setEndTime = this.setEndTime.bind(this);

    this.updateDatabase = this.updateDatabase.bind(this);

    this.getShiftInfo = this.getShiftInfo.bind(this);

    this.deleteShift = this.deleteShift.bind(this);
  }

  buildDayCell(day) {
    const defaultStyles = {
      width: '1.35%',
      height: '9vh',
      borderBottom: '1px solid black'
    };

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

  buildHeaderCell() {
    const defaultStyles = {
      width: '1.35%',
      height: '8vh',
      borderTop: '1px solid black',
      borderBottom: '1px solid black'
    };

    const headerTimes = ['6', '', '', '', '7', '', '', '', '8', '', '', '', '9', '', '', '', '10', '', '', '', '11', '', '', '', '12', '', '', '', '1', '', '', '', '2', '', '', '', '3', '', '', '', '4', '', '', '', '5', '', '', '', '6', '', '', '', '7', '', '', '', '8', '', '', '', '9', '', '', '', '10', '', '', '', '11', '', '', ''];

    return (
      headerTimes.map((element, index) => {
        const isFirst15Minutes = index % 4 === 0;
        const isFinal15Minutes = index === 71;
        const style = {
          backgroundColor: undefined,
          borderRight: undefined,
          borderLeft: undefined
        };
        if (isFirst15Minutes) style.borderLeft = '1px solid black';
        if (isFinal15Minutes) style.borderRight = '1px solid black';
        return <th key={index} className="d-flex align-items-center pb-2" style={{ ...defaultStyles, ...style }}>{element}</th>;
      })
    );
  }

  cancelSubmitModal() {
    this.setState({
      submit: false
    });
  }

  closeSelectSessionModal(event) {
    event.preventDefault();
    this.setState({
      selectSession: false
    });
  }

  componentDidMount() {
    this.getSessions();
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

  getEnteredAvailability(sessionId) {
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'user_id': this.state.userId,
        'session_id': sessionId
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`/api/operator-entered-availability.php`, data)
      .then(response => response.json())
      .then(data => {
        this.setState({
          availability: data
        });
      })
      .catch(error => { throw (error); });
  }

  getEnteredAvailabilityToStart() {
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'user_id': this.state.userId,
        'session_id': this.state.sessionId
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`/api/operator-entered-availability.php`, data)
      .then(response => response.json())
      .then(data => {
        this.setState({
          availability: data
        });
      })
      .catch(error => { throw (error); });
  }

  getAvailabilityInfo(sessionId) {
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'session_id': sessionId,
        'user_id': this.state.userId
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`/api/operator-availability-info.php`, data)
      .then(response => response.json())
      .then(data => {
        this.setState({
          availabilityInfo: data
        });
      })
      .catch(error => { throw (error); });
  }

  getAvailabilityInfoToStart() {
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'session_id': this.state.sessionId,
        'user_id': this.state.userId
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`/api/operator-availability-info.php`, data)
      .then(response => response.json())
      .then(data => {
        this.setState({
          availabilityInfo: data
        }, this.getEnteredAvailabilityToStart);
      })
      .catch(error => { throw (error); });
  }

  getSessions() {
    const data = {
      method: 'POST',
      body: JSON.stringify({
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`/api/sessions.php`, data)
      .then(response => response.json())
      .then(data => {
        this.setState({
          sessionChoices: data
        }, this.setDefaultSession);
      })
      .catch(error => { throw (error); });
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

  handleFormEntry(event) {
    var index = event.nativeEvent.target.selectedIndex;
    var updatedSessionId = event.target.value;
    var updatedName = event.nativeEvent.target[index].text;
    this.getAvailabilityInfo(updatedSessionId);
    this.getEnteredAvailability(updatedSessionId);
    this.setState({
      sessionName: updatedName,
      sessionId: updatedSessionId
    });
  }

  handleCommentEntry(event) {
    this.setState({
      comment: event.target.value
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

  hideShiftModal() {
    this.setState({
      show: false
    });
    const startIndex = this.timeIndex[this.state.selectedStartTime];
    const endIndex = this.timeIndex[this.state.selectedEndTime];

    if (startIndex > endIndex || startIndex === endIndex || endIndex - startIndex < 6) {
      this.showErrorModal();
    } else {
      var availabilityObject = Object.assign({}, this.state.availability);
      var availabilityDay = availabilityObject[this.state.day].map((fifteenMinuteBlock, index) => (index >= startIndex && index < endIndex) ? 1 : (fifteenMinuteBlock === 1) ? 1 : 0
      );
      availabilityObject[this.state.day] = availabilityDay;
      this.setState({
        availability: availabilityObject,
        selectedStartTime: null,
        selectedEndTime: null
      });

    }
  }

  setDefaultSession() {
    var dateToday = new Date();
    var date = getDateString(dateToday);
    this.state.sessionChoices.forEach(element => {
      if (element.startDateString <= date && date <= element.endDateString) {
        this.setState({
          sessionId: element.id,
          sessionName: element.name
        }, this.getAvailabilityInfoToStart);
      }
    });
  }

  setEndTime(event) {
    const storedEndTimeIndex = this.timeIndex[this.state.selectedEndTime];
    const newEndTimeIndex = this.timeIndex[event.currentTarget.textContent];
    let availabilityObject = Object.assign({}, this.state.availability);

    if (storedEndTimeIndex) {
      if (storedEndTimeIndex > newEndTimeIndex) {
        var availabilityDay = availabilityObject[this.state.day].map((fifteenMinuteBlock, index) =>
          (index <= storedEndTimeIndex && index >= newEndTimeIndex) ? 0 : fifteenMinuteBlock === 1 ? 1 : 0
        );
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
    const storedStartTimeIndex = this.timeIndex[this.state.selectedStartTime];
    const newStartTimeIndex = this.timeIndex[event.currentTarget.textContent];
    let availabilityObject = Object.assign({}, this.state.availability);

    if (storedStartTimeIndex >= 0) {
      if (storedStartTimeIndex < newStartTimeIndex) {
        let availabilityDay = availabilityObject[this.state.day].map((fifteenMinuteBlock, index) =>
          (index >= storedStartTimeIndex && index < newStartTimeIndex) ? 0 : fifteenMinuteBlock === 1 ? 1 : 0
        );
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

  showErrorModal() {
    this.setState({
      error: true
    });

  }

  showSelectSessionModal() {
    this.setState({
      selectSession: true
    });
  }

  showSubmitModal() {
    this.setState({
      submit: true
    });
  }

  showShiftModal(event) {
    this.setState({
      show: true,
      day: event.currentTarget.id
    });
  }

  submitOrMessage() {
    if (this.state.availabilityInfo) {
      var dateToday = new Date();
      var date = getDateString(dateToday);

      var totalAvailability = this.totalEnteredAvailability();

      var minimumAvailability;

      if (this.state.availabilityInfo[0].role === 'operator') {
        minimumAvailability = parseInt(this.state.availabilityInfo[0].min_operator_hours) * 60;
      }
      if (this.state.availabilityInfo[0].role === 'operations') {
        minimumAvailability = parseInt(this.state.availabilityInfo[0].min_operations_hours) * 60;
      }
      if (this.state.availabilityInfo[0].role === 'trainer') {
        minimumAvailability = parseInt(this.state.availabilityInfo[0].min_trainer_hours) * 60;
      }
      if (this.state.availabilityInfo[0].role === 'trainee') {
        minimumAvailability = parseInt(this.state.availabilityInfo[0].min_trainee_hours) * 60;
      }

      if (date >= this.state.availabilityInfo[0].availStartDateString && date <= this.state.availabilityInfo[0].availEndDateString && totalAvailability >= minimumAvailability) {
        return (
          <button type="button" className="btn btn-primary btn-sm mr-5" onClick={this.showSubmitModal}>{totalAvailability / 60} / {minimumAvailability / 60} hrs SUBMIT</button>
        );
      } if (date >= this.state.availabilityInfo[0].availStartDateString && date <= this.state.availabilityInfo[0].availEndDateString && totalAvailability < minimumAvailability) {
        return (
          <button type="button" className="btn btn-dark btn-sm mr-4">{totalAvailability / 60} / {minimumAvailability / 60} hrs ENTER MORE</button>
        );
      } else {
        return (
          <button type="button" className="btn btn-dark btn-sm mr-4">Submission Closed</button>
        );
      }
    }
  }

  totalEnteredAvailability() {
    var number15MinuteBlocks = 0;
    for (var key in this.state.availability) {
      for (var index = 0; index < this.state.availability[key].length; index++) {
        if (this.state.availability[key][index]) {
          number15MinuteBlocks++;
        }
      }
    }
    return number15MinuteBlocks * 15;
  }

  updateDatabase() {
    fetch('/api/operator-availability.php', {
      method: 'POST',
      body: JSON.stringify({
        'user_id': this.state.userId,
        'availability': this.state.availability,
        'session_id': this.state.sessionId,
        'comment': this.state.comment
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .catch(error => { throw (error); });
  }

  render() {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (!this.state.availabilityInfo) {
      return <div>Loading</div>;
    }

    return (
      <React.Fragment>
        <TopMenuGeneral title="MY AVAILABILITY"/>
        <div className="ml-3" style={{ fontWeight: 'bold', fontSize: '1.0em' }}>{this.state.sessionName}</div>
        <div className="d-flex justify-content-between">
          <div className='mb-0 ml-3'>Click day and approx. time to add, change, or delete.</div>
          <div>
            <button type="button" className="btn btn-primary btn-sm mr-2" onClick={this.showSelectSessionModal}>Select Session</button>
            {this.submitOrMessage()}
          </div>
        </div>
        <div className="d-flex">
          <div style={{ width: '5%' }}></div>
          <table className="mt-2 mr-0" style={{ width: '90%' }}>
            <thead className="container">
              <tr className="row d-flex justify-content-end">
                <th style={{ width: '2.8%', height: '8vh', borderLeft: '1px solid black', borderBottom: '1px solid black', borderTop: '1px solid black' }}></th>
                {this.buildHeaderCell()}
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

        <SelectAvailabilityModal day={this.state.day} show={this.state.show} close={this.hideShiftModal} deleteShift={this.deleteShift}>
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
            <p className='mt-3 mb-2 ml-3 mr-3 text-align-center'>The end time must be at least 1 hr 30 min after the start time.</p>
          </div>
        </ErrorModal>

        <SubmitModal day={this.state.day} submitShow={this.state.submit}>
          <div className="d-flex flex-column">
            <div>
              <div className="mt-4">Comments:</div>
              <textarea rows="4" cols="40" maxLength="150" onChange={this.handleCommentEntry}value={this.state.comment}></textarea>
            </div>
            <div className="mt-4 mb-2 d-flex justify-content-center">Submit your available times?</div>
            <div className="d-flex justify-content-center">
              <button className="btn btn-secondary center-block mb-3" onClick={this.handleSubmitModal}>Yes</button>
              <button className="btn btn-primary center-block mb-3 ml-3" onClick={this.cancelSubmitModal}>CANCEL</button>
            </div>
          </div>
        </SubmitModal>

        <SelectSessionModal showSelectSessionModal={this.state.selectSession}>
          <div className="d-flex justify-content-center">
            <form onSubmit={this.closeSelectSessionModal}>
              <div className="m-2">
                <div className="mb-2" style={{ fontWeight: 'bold' }}>MY SESSIONS</div>
                <select name="sessionId" onChange={this.handleFormEntry}>
                  <option>Select Session</option>
                  {this.state.sessionChoices.map((session, index) => (<option key={index} value={session['id']}>{session['name']}</option>))}
                </select>
              </div>
              <div className="mt-4 mr-2 ml-2 mb-5 d-flex justify-content-center">
                <button className="btn-success mr-2" type='submit'>Close</button>
              </div>
            </form>
          </div>
        </SelectSessionModal>

      </React.Fragment>
    );
  }
}

export default OperatorAvailability;
