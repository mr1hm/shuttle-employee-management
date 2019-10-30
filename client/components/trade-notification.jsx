import React from 'react';
import RouteBusDisplay from './route-bus-display';
import { convertMilitaryTime, calcShiftLenghtInHourMinFormat, createDateStringFromDateObject } from '../lib/time-functions';
import TopMenuGeneral from './topmenu/topmenu-general';
import { Link } from 'react-router-dom';

class TradeNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newShifts: [],
      selectedDriver: {}
    };
    this.removeShift = this.removeShift.bind(this);
    this.giveShifttoSelectedDriver = this.giveShifttoSelectedDriver.bind(this);
  }
  componentDidMount() {
    fetch(`/api/get-notifications.php?id=${this.props.userId}`)
      .then(response => response.json())
      .then(shiftsArrayOfObjects => {
        this.setState({
          newShifts: shiftsArrayOfObjects
        });
      })
      .catch(error => console.error('Fetch failed', error));
  }
  giveShifttoSelectedDriver(roundID, targetID) {
    const selectedDriverToTradeWith = {
      user_id: this.props.userId,
      target_id: targetID,
      user_round: roundID
    };
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch('/api/make-shift-trade.php', {
      method: 'POST',
      body: JSON.stringify(selectedDriverToTradeWith),
      headers: headers
    })
      .catch(error => console.error('Fetch failed', error));
    const newShifts = this.state.newShifts.filter(oneShift => roundID !== oneShift.round_id);
    this.setState({
      newShifts: newShifts
    });
  }
  removeShift(roundID) {
    const response = fetch('/api/decline-shift-trade.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: roundID
      })
    });
    response.catch(err => console.error(err));
    const newShifts = this.state.newShifts.filter(oneShift => roundID !== oneShift.round_id);
    this.setState({
      newShifts: newShifts
    });
  }
  render() {
    if (!this.state.newShifts) {
      return (
        <div className="container mt-2">
          <div className="row justify-content-center">
            <div className="col-4">
              <h1>No Notifications</h1>
            </div>
          </div>
        </div>);
    }
    return (
      <div className="container">
        <div className="row justify-content-center mb-3">
          <TopMenuGeneral userId={this.props.userId} title="Notifications" newShiftsandSelectedDriver={this.state.newShiftsandSelectedDriver} />
        </div>
        <div className="row text-center">
          <div className="col-2">
            <h5>Date</h5>
          </div>
          <div className="col-2">
            <h5>Bus Line/Number</h5>
          </div>
          <div className="col-2">
            <h4>Shift Time</h4>
          </div>
          <div className="col-2">
            <h4>Shift Length</h4>
          </div>
        </div>
        {this.state.newShifts.map(oneShift => {
          return (
            <div key={oneShift.id} className="row mb-3 text-center">
              <div className="col-2">
                {createDateStringFromDateObject(parseInt(oneShift.shift_date) * 1000)}
              </div>
              <div className="col-2">
                <RouteBusDisplay route={oneShift.line_name} bus={oneShift.bus_info_id} />
              </div>
              <div className="col-2">{convertMilitaryTime(oneShift.start_time) + '-' + convertMilitaryTime(oneShift.end_time)}</div>
              <div className="col-2">{calcShiftLenghtInHourMinFormat(oneShift.start_time, oneShift.end_time)}</div>
              <div className="col-2">
                <button onClick={() => this.giveShifttoSelectedDriver(oneShift.round_id, oneShift.target_user_id)} type="button" className="btn btn-success">Take Shift</button>
              </div>
              <div className="col-2">
                <button onClick={() => this.removeShift(oneShift.round_id)} type="button" className="btn btn-danger">Remove Shift</button>
              </div>
            </div>
          );
        })}
        <div className="row justify-content-center mt-5">
          <div className="col-3">
            <Link to={{
              pathname: '/shifts/month/shifts-month/',
              state: {
                swapFlag: true
              }
            }}
            className="btn btn-dark">Swap</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default TradeNotification;
