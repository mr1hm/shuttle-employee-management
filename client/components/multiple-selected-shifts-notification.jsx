import React from 'react';
import { Link } from 'react-router-dom';
import RouteBusDisplay from './route-bus-display';
import {
  getZeroPaddedNumber,
  convertMilitaryTime,
  calcShiftLenghtInHourMinFormat,
  createDateStringFromDateObject
} from '../lib/time-functions';

class MultipleSelectedShiftsSwap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shifts: []
    };
    this.removeShift = this.removeShift.bind(this);
  }

  componentDidMount() {
    const shifts = this.props.shifts ? this.props.shifts : [];
    this.setState({
      shifts: shifts
    });
  }

  removeShift() {
    const shifts = this.state.shifts;
    let roundIds = [];
    for (let integerI = 0; integerI < shifts.length; integerI++) {
      roundIds.push(this.props.shifts[integerI].round_id);
    }
    fetch(`/api/decline-shift-trade.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: roundIds
      })
    })
      .then(response => {
        this.setState({
          shifts: []
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    const shifts = this.state.shifts;
    const today = new Date();
    const dateString = `${today.getFullYear()}-${getZeroPaddedNumber(today.getMonth() + 1)}-${getZeroPaddedNumber(today.getDate())}`;
    let roundIds = [];
    for (let integerI = 0; integerI < shifts.length; integerI++) {
      roundIds.push(this.props.shifts[integerI].round_id);
    }
    if (shifts.length === 0) {
      return null;
    } else {
      return (
        <div className="row mb-3 text-center">
          <div className="col-2">
            {createDateStringFromDateObject(parseInt(shifts[0].shift_date) * 1000)}
          </div>
          <div className="col-2">
            <RouteBusDisplay route={shifts[0].line_name} bus={shifts[0].bus_info_id} />
          </div>
          <div className="col-2">{convertMilitaryTime(shifts[0].start_time) + '-' + convertMilitaryTime(shifts[shifts.length - 1].end_time)}</div>
          <div className="col-2">{calcShiftLenghtInHourMinFormat(shifts[0].start_time, shifts[shifts.length - 1].end_time)}</div>
          <div className="col-2">
            <Link to={{
              pathname: '/shifts/month/shifts-month/' + dateString,
              state: {
                swapFlag: roundIds
              }
            }}
            className="btn btn-dark">
              Swap
            </Link>
            {/* <button type="button" className="btn btn-dark">Swap</button> */}
          </div>
          <div className="col-2">
            <button onClick={this.removeShift} type="button" className="btn btn-danger">Remove Shift</button>
          </div>
        </div>
      );
    }
  }
}

export default MultipleSelectedShiftsSwap;
