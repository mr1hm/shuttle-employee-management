import React from 'react';
import { Link } from 'react-router-dom';
import RouteBusDisplay from './route-bus-display';
import { convertMilitaryTime, calcShiftLenghtInHourMinFormat, createDateStringFromDateObject } from '../lib/time-functions';

class NotificationShift extends React.Component {
  removeShift(id) {
    this.props.removeShift(id);
  }
  giveShifttoSelectedDriver(round_id, target_id) {
    this.props.giveShifttoSelectedDriver(round_id, target_id);
  }
  renderOperations() {
    const { round_id, target_user_id } = this.props;
    if (this.props.type === 'trade') {
      return (
        <button
          onClick={() => this.giveShifttoSelectedDriver(round_id, target_user_id)}
          type="button"
          className="btn btn-success">
          Take Shift
        </button>
      );
    } else if (this.props.type === 'swap') {

      return (
        <Link to={{
          pathname: '/shifts/month/shifts-month/',
          state: {
            swapFlag: true
          }
        }}
        className="btn btn-dark">
            Swap
        </Link>
      );
    }
  }
  render() {
    const { shift_date, line_name, bus_info_id, start_time, end_time, target_user_id, round_id } = this.props;
    const operation = this.renderOperations();
    return (
      <div className="row mb-3 text-center">
        <div className="col-2">
          {createDateStringFromDateObject(parseInt(shift_date) * 1000)}
        </div>
        <div className="col-2">
          <RouteBusDisplay route={line_name} bus={bus_info_id} />
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
