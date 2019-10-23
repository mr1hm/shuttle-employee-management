import React from 'react';
import TopMenuGeneral from './topmenu/topmenu-general';
import './operator-availability.css';
import OperatorAvailabilityModal from './operator-availability-modal';

// dummy data only right now (not connected to endpoint)
class OperatorAvailability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availability: {
        'Sunday': [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Monday': [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Tuesday': [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Wednesday': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Thursday': [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Friday': [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Saturday': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      show: false,
      day: null,
      selectedStartTime: 0,
      selectedEndTime: 0
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.setStartTime = this.setStartTime.bind(this);
    this.setEndTime = this.setEndTime.bind(this);
  }

  buildDayCell(day) {
    return (
      this.state.availability[day].map((element, index) => {
        if (element) {
          return <td key={index} style={{ backgroundColor: 'green', width: '1.35%', height: '10vh', border: '1px solid black' }}></td>;
        } else {
          return <td key={index} style={{ backgroundColor: 'lightgrey', width: '1.35%', height: '10vh', border: '1px solid black' }}></td>;
        }
      })
    );
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
      show: false,
      selectedStartTime: 0,
      selectedEndTime: 0
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
    const times = ['6:00', '6:15', '6:30', '6:45', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45', '9:00', '9:15', '9:30', '9:45', '10:00'];
    return (
      <React.Fragment>
        <TopMenuGeneral title="MY AVAILABILITY"/>
        <div className="d-flex">
          <div style={{ width: '5%' }}></div>
          <table className="mt-5 mr-0" style={{ width: '90%' }}>
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
                      <td className="align-middle" style={{ backgroundColor: 'white', width: '2.8%', heigth: '10vh', border: '1px solid black' }}>
                        {day.slice(0, 3)}
                        <button id={day} onClick={this.showModal} className="p-0 m-0" style={{ backgroundColor: 'yellow', border: '1px solid black' }} type="button">Add</button>
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
        <OperatorAvailabilityModal day={this.state.day} show={this.state.show} close={this.hideModal}>
          <div className="d-flex">
            <div className="mr-2">
              <div className="m-2 border" id="startTime">{this.state.selectedStartTime}</div>
              <div className="dropdown mb-2">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                StartTime
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
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
                <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
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
        </OperatorAvailabilityModal>
      </React.Fragment>
    );
  }
}

export default OperatorAvailability;
