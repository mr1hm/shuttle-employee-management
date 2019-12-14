import React from 'react';
import { Link } from 'react-router-dom';
import RouteBusDisplay from './route-bus-display';
import {
  getZeroPaddedNumber,
  convertMilitaryTime,
  calcShiftLenghtInHourMinFormat,
} from '../lib/time-functions';

class NotificationShift extends React.Component {
  removeShift(id) {
    this.props.removeShift(id);
  }
  giveShifttoSelectedDriver(roundId, targetId) {
    this.props.giveShifttoSelectedDriver(roundId, targetId);
  }
  renderOperations() {
    const { round_id: roundId, target_user_id: targetUserId } = this.props;
    const today = new Date();
    const dateString = `${today.getFullYear()}-${getZeroPaddedNumber(today.getMonth() + 1)}-${getZeroPaddedNumber(today.getDate())}`;
    if (this.props.type === 'trade') {
      return (
        <button
          onClick={() => this.props.giveShifttoSelectedDriver(roundId, targetUserId)}
          type="button"
          className="btn btn-success w-75">
          Take Shift
        </button>
      );
    } else if (this.props.type === 'swap') {

      return (
        <Link to={{
          pathname: '/shifts/month/shifts-month/' + dateString,
          state: {
            swapFlag: roundId
          }
        }}
        className="btn btn-dark w-75">
            Swap
        </Link>
      );
    }
  }
  render() {
    const { shift_date: shiftDate, line_name: lineName, start_time: startTime, end_time: endTime, round_id: roundId, busNumber } = this.props;
    const operation = this.renderOperations();
    return (
      <div className="row mb-3 text-center">
        <div className="col-2">
          {shiftDate}
        </div>
        <div className="col-2">
          <RouteBusDisplay route={lineName} bus={busNumber} />
        </div>
        <div className="col-2">{convertMilitaryTime(startTime) + '-' + convertMilitaryTime(endTime)}</div>
        <div className="col-2">{calcShiftLenghtInHourMinFormat(startTime, endTime)}</div>
        <div className="col-2">
          {operation}
        </div>
        <div className="col-2">
          <button onClick={() => this.removeShift(roundId)} type="button" className="btn btn-danger">Remove Shift</button>
        </div>
      </div>
    );
  }
}

export default NotificationShift;
