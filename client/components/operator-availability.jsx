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
      show: false
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
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

  showModal() {
    this.setState({
      show: true
    });
  }

  hideModal() {
    this.setState({
      show: false
    });
  }

  render() {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
                        <button onClick={this.showModal} className="p-0 m-0" style={{backgroundColor: 'yellow', border: '1px solid black'}}>Add</button>
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
        <OperatorAvailabilityModal show={this.state.show} close={this.hideModal}>
          <p>This is a test</p>
          <p>This is the second line of the test</p>
        </OperatorAvailabilityModal>
      </React.Fragment>
    );
  }
}

export default OperatorAvailability;
