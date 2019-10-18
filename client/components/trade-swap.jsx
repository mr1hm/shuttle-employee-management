import React from 'react';
import RouteBusDisplay from './route-bus-display';
import TradeModal from './trade-modal';
import SwapModal from './swap-modal';
import { convertMilitaryTime, calcShiftLenghtInHourMinFormat } from '../lib/time-functions';

class TradeSwap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availableDrivers: [],
      selectedDriver: {}
    };
    this.handleDriverClick = this.handleDriverClick.bind(this);
  }
  componentDidMount() {
    this.getAvailableDrivers();
  }

  handleDriverClick(event) {
    const driverId = event.target.id;
    const selectedDriver = this.state.availableDrivers.find(driver => driver.user_id === driverId);
    this.setState({
      selectedDriver: selectedDriver
    });
  }
  getAvailableDrivers() {
    const date = this.props.shiftDetails[0].date;
    const startTime = this.props.shiftDetails[0].start_time;
    const endTime = this.props.shiftDetails[this.props.shiftDetails.length - 1].end_time;
    fetch(`/api/get-available-drivers.php?date=${date}&start_time=${startTime}&end_time=${endTime}`)
      .then(response => response.json())
      .then(details => {
        this.setState({
          availableDrivers: details
        });
      })
      .catch(error => { throw (error); });
  }

  render() {
    const rounds = this.props.shiftDetails;
    const confirmationText = (Object.keys(this.state.selectedDriver).length !== 0) ? `Trade or Swap with ${this.state.selectedDriver.first_name} ${this.state.selectedDriver.last_name}?` : 'Select Coworker';
    return (
      <div className="container d-flex flex-column justify-content-around h-100">
        <div className="row">
          <h1> Trade/Swap </h1>
        </div>
        <div className="row justify-content-center">
          <div className="btn-group w-50">
            <button className="btn btn-secondary btn-lg dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {confirmationText}
            </button>
            <div className="dropdown-menu w-100">
              {this.state.availableDrivers.map(singleDriver => {
                return <button onClick={this.handleDriverClick} className="dropdown-item" type="button" id={singleDriver.user_id} key={singleDriver.user_id}>{singleDriver.first_name} {singleDriver.last_name}</button>;
              })}
            </div>
          </div>
        </div>
        {rounds.map(oneShift => {
          return (
            <div key={oneShift.roundID} className="row justify-content-center text-center">
              <div className="col">
                <RouteBusDisplay route={oneShift.line_name} bus={oneShift.bus_info_id} />
              </div>
              <div className="col">{convertMilitaryTime(oneShift.start_time) + '-' + convertMilitaryTime(oneShift.end_time)}</div>
              <div className="col">{calcShiftLenghtInHourMinFormat(oneShift.start_time, oneShift.end_time)}</div>
            </div>
          );
        })}
        <div className="row h-25 justify-content-center">
          <div className="col h-50 d-flex justify-content-center">
            <button type="button" onClick={this.props.history.goBack} className="btn btn-lg btn-light w-75">Cancel</button>
          </div>
          <div className="col h-50 d-flex justify-content-center">
            <button type="button" data-toggle="modal" data-target="#tradeModal" className="btn btn-lg btn-success w-75">Trade</button>
              <>
                <TradeModal selectedDriver={this.state.selectedDriver} allShifts={rounds}/>
              </>
          </div>
          <div className="col h-50 d-flex justify-content-center">
            <button type="button" data-toggle="modal" data-target="#swapModal" className="btn btn-lg btn-primary w-75">Swap</button>
              <>
              <SwapModal selectedDriver={this.state.selectedDriver} allShifts={rounds} />
              </>
          </div>
        </div>
      </div>
    );
  }
}

export default TradeSwap;