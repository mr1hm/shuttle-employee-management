import React from 'react';
import { Link } from 'react-router-dom';
import { calcShiftLenghtInHourMinFormat, convertMilitaryTime } from '../../../lib/time-functions';
import RouteBusDisplay from '../../route-bus-display';

class SingleShift extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.openDetails = this.openDetails.bind(this);
  }
  openDetails() {
    const { openRouteDetails, shifts } = this.props;
    openRouteDetails(shifts.roundID, shifts.date);
  }

  render() {
    const { shifts, view } = this.props;
    let shiftHours = calcShiftLenghtInHourMinFormat(shifts.start_time, shifts.end_time);
    let statusIndicator = (parseInt(shifts['COUNT(DISTINCT rd.`status`)']) > 1)
      ? 'Scheduled/Posted'
      : shifts.status;
    let numOfRounds = shifts.roundCount;
    if (!shifts['MIN(`start_time`)']) {
      shiftHours = calcShiftLenghtInHourMinFormat(shifts.start_time, shifts.end_time);
    }
    // Change link to pass state
    return (
      <tr>
        <td> <RouteBusDisplay bus={shifts.bus_info_id} route={shifts.line_name} /> </td>
        <td> {convertMilitaryTime(shifts.start_time)} - {convertMilitaryTime(shifts.end_time)} </td>
        <td> {numOfRounds} </td>
        <td> {shiftHours} </td>
        <td style={{ display: this.props.modalStatus ? 'none' : 'block' }}> {statusIndicator} </td>
        <td>
          <Link to="/shifts/details/" className="btn btn-dark"
            onClick={this.openDetails}>
            Details
          </Link>
        </td>
      </tr>
    );
  }
}

export default SingleShift;
