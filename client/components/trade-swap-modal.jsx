import React from 'react';
import RouteBusDisplay from './route-bus-display';
import TradeModal from './trade-modal';
import SwapModal from './swap-modal';
import {calcShiftLengthInHourMinFormat} from '../lib/time-functions';

class TradeSwap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availableDrivers:[],
      selectedDriver:{}
    }
    this.handleDriverClick=this.handleDriverClick.bind(this);
  }
  componentDidMount(){
    this.getAvailableDrivers();
  }

  handleDriverClick(event){
    const driverId= event.target.id;
    const selectedDriver=this.state.availableDrivers.find(driver => driver.user_id === driverId);
    this.setState({
      selectedDriver:selectedDriver
    })
  }
  getAvailableDrivers() {
    fetch('/api/trade-swap.php?date=1566100800&start_time=700&end_time=720')
      .then(response =>  response.json() )
      .then(details => {
        this.setState({
          availableDrivers: details
        })
      })
      .catch(error => { throw (error) });
  }

  render() {
    debugger;
    const rounds = this.props.roundArray;
    const timeSpan = this.props.timeSpan;
    const dateAndRound = this.props.dateAndRound;
    const confirmationText= (Object.keys(this.state.selectedDriver).length !== 0) ? `Trade or Swap with ${this.state.selectedDriver.first_name} ${this.state.selectedDriver.last_name}?` : "Select Coworker";
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
                  return <button onClick={this.handleDriverClick} className="dropdown-item" type="button" id={singleDriver.user_id} key={singleDriver.user_id}>{singleDriver.first_name} {singleDriver.last_name}</button>
                })}
            </div>
            </div>
          </div>
          {/* <div className="row justify-content-center h-25"> */}
            {rounds.map(oneShift => {
              return (
                <tr key={oneShift.roundID} className="row">
                  <td>
                    <RouteBusDisplay route={this.props.route} bus={this.props.busNumber} />
                  </td>
                  <td>{oneShift.start_time}-{oneShift.end_time}</td>
                  {/* <div className="col-4">{calcShiftLengthInHourMinFormat(oneShift.start_time,oneShift.end_time)}</div> */}
                </tr>
              )
            })}
            {/* <div className="col-1">
              <RouteBusDisplay route={this.props.route} bus={this.props.busNumber} />
            </div>
            <div className="col-4">
              {timeSpan}
              <div>
                {dateAndRound}
              </div>
            </div> */}
          {/* </div> */}
          <div className="row h-25 justify-content-center">
            <div className="col h-50 d-flex justify-content-center ">
              <button type="button" onClick={()=>this.props.close()} className="btn btn-lg btn-light w-75">Cancel</button>
            </div>
            <div className="col h-50 d-flex justify-content-center">
              <button type="button" data-toggle="modal" data-target="#tradeModal" className="btn btn-lg btn-success w-75">Trade</button>
              <>
                <TradeModal selectedDriver={this.state.selectedDriver} time={timeSpan} date={dateAndRound} route={this.props.route} bus={this.props.busNumber} />
              </>
            </div>
            <div className="col h-50 d-flex justify-content-center">
              <button type="button" data-toggle="modal" data-target="#swapModal" className="btn btn-lg btn-primary w-75">Swap</button>
              <>
              <SwapModal selectedDriver={this.state.selectedDriver} time={timeSpan} date={dateAndRound} route={this.props.route} bus={this.props.busNumber} />
              </>
            </div>
          </div>
        </div>
      );
  }
}

export default TradeSwap;
