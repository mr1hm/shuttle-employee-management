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
  }
  componentDidMount() {
    const newShifts = this.props.location.state.newShiftsAndSelectedDriver.newShifts;
    const selectedDriver = this.props.location.state.newShiftsAndSelectedDriver.selectedDriver;
    debugger;
    this.setState({
      newShifts: newShifts,
      selectedDriver: selectedDriver
    });
  }
  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <h1>Notifications</h1>
        </div>
        {this.state.newShifts.map(oneShift => {
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
      </div>
    );
  }
}

export default TradeNotification;
