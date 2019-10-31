import React from 'react';
import RouteBusDisplay from './route-bus-display';
import TradeModal from './trade-modal';
import SwapModal from './swap-modal';
import Switch from './switch';
import { convertMilitaryTime, calcShiftLenghtInHourMinFormat, returnWeekInfoArray } from '../lib/time-functions';

class TradeSwap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availableDrivers: [],
      selectedDriver: {},
      toggleButtonisOn: false
    };
    this.handleDriverClick = this.handleDriverClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }
  componentDidMount() {
    if (this.props.shiftDetails.length > 0) {
      this.getAvailableDrivers();
    }
  }

  handleDriverClick(event) {
    const driverId = event.target.id;
    const selectedDriver = this.state.availableDrivers.find(driver => driver.id === parseInt(driverId));
    const selectedDriverObj = {
      'first_name': selectedDriver.firstName,
      'last_name': selectedDriver.lastName,
      'user_id': selectedDriver.id
    };
    this.setState({
      selectedDriver: selectedDriverObj
    });
  }
  getAvailableDrivers() {
    const week = returnWeekInfoArray(this.props.shiftDetails[0].date);
    let roundTimes = [];
    this.props.shiftDetails.map(oneShift => {
      roundTimes.push({
        'start_time': oneShift.start_time,
        'stop_time': oneShift.end_time
      });
    });
    const roundTimesString = JSON.stringify(roundTimes);
    const date = this.props.shiftDetails[0].date;
    fetch(`/api/admin-available-operators.php?date=${date}&sunday=${week[0]}&saturday=${week[6]}&round_time=${roundTimesString}`)
      .then(response => response.json())
      .then(details => {
        this.setState({
          availableDrivers: details
        });
      })
      .catch(error => { throw (error); });
  }
  handleToggle() {
    this.setState({
      toggleButtonisOn: !this.state.toggleButtonisOn
    });
  }

  render() {

    const rounds = this.props.shiftDetails;
    let confirmationText = '';
    if (Object.keys(this.state.selectedDriver).length !== 0) {
      if (this.state.toggleButtonisOn) {
        confirmationText = `Swap with ${this.state.selectedDriver.first_name} ${this.state.selectedDriver.last_name}?`;
      } else {
        confirmationText = `Trade with ${this.state.selectedDriver.first_name} ${this.state.selectedDriver.last_name}?`;
      }
    } else {
      confirmationText = 'Select Coworker';
    }
    if (this.props.shiftDetails.length === 0) {
      return (
        <div className="container mt-2">
          <div className="row justify-content-center">
            <div className="col-4">
              <h1>No Shifts Selected</h1>
            </div>
          </div>
        </div>);
    } else {
      return (
        <div className="container d-flex flex-column justify-content-around h-100">
          <div className="row">
            <div className="col-5 mt-3 d-flex justify-content-end">
              <Switch isOn={this.state.toggleButtonisOn} handleToggle={this.handleToggle} />
            </div>
            <div className="col-6 ml-5 mt-3">
              {this.state.toggleButtonisOn ? (
                <h1> Swap </h1>
              ) : (
                <h1> Trade </h1>
              )}
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="btn-group w-50">
              <button className="btn btn-secondary btn-lg dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {confirmationText}
              </button>
              <div className="dropdown-menu w-100">
                {this.state.availableDrivers.map(singleDriver => {
                  return <button onClick={this.handleDriverClick} className="dropdown-item" type="button" id={singleDriver.id} key={singleDriver.id}>{singleDriver.firstName} {singleDriver.lastName}</button>;
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
            {this.state.toggleButtonisOn ? (
              <div className="col h-50 d-flex justify-content-center">
                <button type="button" data-toggle="modal" data-target="#swapModal" className="btn btn-lg btn-primary w-75">Swap</button>
                <>
                  <SwapModal selectedDriver={this.state.selectedDriver} allShifts={rounds} />
                </>
              </div>
            ) : (
              <div className="col h-50 d-flex justify-content-center">
                <button type="button" data-toggle="modal" data-target="#tradeModal" className="btn btn-lg btn-success w-75">Trade</button>
                  <>
                    <TradeModal selectedDriver={this.state.selectedDriver} allShifts={rounds} />
                  </>
              </div>
            )}
          </div>
        </div>
      );
    }
  }
}

export default TradeSwap;
