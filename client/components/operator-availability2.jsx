import React from 'react';
import TopMenuGeneral from './topmenu/topmenu-general';
import './operator-availability.css';
import SubmitModal from './operator-submit-modal';

// dummy data only right now (not connected to endpoint)
class OperatorAvailability2 extends React.Component {
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
      submit: false,
      day: null,
      changeIndex: null,
      userId: 45,
      sessionId: 1
    };
    this.changeColor = this.changeColor.bind(this);
    this.rebuildAvailability = this.rebuildAvailability.bind(this);
    this.updateDatabase = this.updateDatabase.bind(this);
    this.showSubmitModal = this.showSubmitModal.bind(this);
    this.handleSubmitModal = this.handleSubmitModal.bind(this);
    this.cancelSubmitModal = this.cancelSubmitModal.bind(this);
  }

  changeColor(event) {
    var changeIndex = event.currentTarget.id;
    var day = event.currentTarget.className;
    this.rebuildAvailability(changeIndex, day);
    this.buildDayCell(day);
  }

  buildDayCell(day) {
    return (
      this.state.availability[day].map((element, index) => {
        if (element) {
          return <td key={index} id={index} className={day} onClick={this.changeColor} style={{ backgroundColor: 'green', width: '1.35%', height: '10vh', border: '1px solid black' }}></td>;
        } else {
          return <td key={index} id={index} className={day} onClick={this.changeColor} style={{ backgroundColor: 'initial', width: '1.35%', height: '10vh', border: '1px solid black' }}></td>;
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

  rebuildAvailability(changeIndex, day) {
    var availabilityObject = Object.assign({}, this.state.availability);
    var availabilityDay = availabilityObject[day].map((element, index) => {
      if (parseInt(changeIndex) === index) {
        if (element) {
          return 0;
        } else {
          return 1;
        }
      } else if (element) {
        return 1;
      } else {
        return 0;
      }
    });
    availabilityObject[day] = availabilityDay;
    this.setState({
      availability: availabilityObject
    });
  }

  showSubmitModal() {
    this.setState({
      submit: true
    });
  }

  handleSubmitModal() {
    this.updateDatabase();
    this.setState({
      submit: false
    });
  }

  cancelSubmitModal() {
    this.setState({
      submit: false
    });
  }

  render() {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
      <React.Fragment>
        <TopMenuGeneral title="MY AVAILABILITY"/>
        <div className="d-flex flex-row-reverse">
          <div style={{ width: '5%' }}></div>
          <button className=" btn btn-primary mt-3" onClick={this.showSubmitModal}>Submit Availability</button>
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

        <SubmitModal day={this.state.day} submitShow={this.state.submit} submitAndClose={this.handleSubmitModal} submitCancel={this.cancelSubmitModal}>
          <div className="d-flex justify-content-center">
            <p className='mt-3 mb-2 ml-3 mr-3 text-align-center'>Are you sure you want to submit your available times?</p>
          </div>
        </SubmitModal>
      </React.Fragment>
    );
  }
}

export default OperatorAvailability2;
