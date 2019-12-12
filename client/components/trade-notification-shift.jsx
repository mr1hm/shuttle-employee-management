import React from 'react';
import { Link } from 'react-router-dom';
import RouteBusDisplay from './route-bus-display';
import {
  getZeroPaddedNumber,
  convertMilitaryTime,
  calcShiftLenghtInHourMinFormat,
  createDateStringFromDateObject
} from '../lib/time-functions';

class NotificationShift extends React.Component {
  removeShift(id) {
    this.props.removeShift(id);
  }
  giveShifttoSelectedDriver(round_id, target_id) {
    this.props.giveShifttoSelectedDriver(round_id, target_id);
  }
  renderOperations() {
    const { round_id, target_user_id } = this.props;
    const today = new Date();
    const dateString = `${today.getFullYear()}-${getZeroPaddedNumber(today.getMonth() + 1)}-${getZeroPaddedNumber(today.getDate())}`;
    if (this.props.type === 'trade') {
      return (
        <button
          onClick={() => this.props.giveShifttoSelectedDriver(round_id, target_user_id)}
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
            swapFlag: round_id
          }
        }}
        className="btn btn-dark w-75">
            Swap
        </Link>
      );
    }
  }
  render() {
    const { shift_date, line_name, bus_info_id, start_time, end_time, target_user_id, round_id, busNumber } = this.props;
    const operation = this.renderOperations();
    return (
      <div className="row mb-3 text-center">
        <div className="col-2">
          {shift_date}
        </div>
        <div className="col-2">
          <RouteBusDisplay route={line_name} bus={busNumber} />
        </div>
        <div className="col-2">{convertMilitaryTime(start_time) + '-' + convertMilitaryTime(end_time)}</div>
        <div className="col-2">{calcShiftLenghtInHourMinFormat(start_time, end_time)}</div>
        <div className="col-2">
          {operation}
        </div>
        <div className="col-2">
          <button onClick={() => this.removeShift(round_id)} type="button" className="btn btn-danger">Remove Shift</button>
        </div>
      </div>
    );
  }
}

export default NotificationShift;
