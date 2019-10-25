import React from 'react';
import RouteBusDisplay from './route-bus-display';
import { convertMilitaryTime, calcShiftLenghtInHourMinFormat } from '../lib/time-functions';

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
      .then(response => response.json())
      .then(data => {
      })
      .catch(error => console.error('Fetch failed', error));

  }
  removeShift(roundID) {
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
        <div className="row justify-content-center">
          <h1>Notifications</h1>
        </div>
        <div className="row text-center">
          <div className="col-2">
            <h5>Bus Line/Number</h5>
          </div>
          <div className="col-3">
            <h4>Shift Time</h4>
          </div>
          <div className="col-3">
            <h4>Shift Length</h4>
          </div>
        </div>
        {this.state.newShifts.map(oneShift => {
          return (
            <div key={oneShift.id} className="row text-center">
              <div className="col-2">
                <RouteBusDisplay route={oneShift.line_name} bus={oneShift.bus_info_id} />
              </div>
              <div className="col-3">{convertMilitaryTime(oneShift.start_time) + '-' + convertMilitaryTime(oneShift.end_time)}</div>
              <div className="col-3">{calcShiftLenghtInHourMinFormat(oneShift.start_time, oneShift.end_time)}</div>
              <div className="col-2">
                <button onClick={() => this.giveShifttoSelectedDriver(oneShift.round_id, oneShift.target_user_id)} type="button" className="btn btn-success">Take Shift</button>
              </div>
              <div className="col-2">
                <button onClick={() => this.removeShift(oneShift.round_id)} type="button" className="btn btn-danger">Remove Shift</button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default TradeNotification;
