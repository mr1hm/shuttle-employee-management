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
    const { openRouteDetails, shifts, queryString } = this.props;
    openRouteDetails(shifts.roundID, shifts.date, queryString);
  }

  render() {
    const { shifts, view } = this.props;
    let shiftButton = (shifts.status === 'posted' && view === 'myShifts') ? 'Cancel Post' : 'Details';
    let shiftHours = calcShiftLenghtInHourMinFormat(shifts.start_time, shifts.end_time);
    let statusIndicator = (parseInt(shifts['COUNT(DISTINCT rd.`status`)']) > 1)
      ? 'Scheduled/Posted'
      : shifts.status;
    let numOfRounds = shifts.roundCount;
    if (view === 'availableShifts') {
      shiftButton = 'Take Shift';
      shiftHours = calcShiftLenghtInHourMinFormat(shifts.start_time, shifts.end_time);
      statusIndicator = shifts.status;
      numOfRounds = 1;
      /* can work on changing this dynamically if needed.  Thought that it would be okay to just hardcode it
        since this view shows the rounds broken up, so they would be 1 */
    }
    if (!shifts['MIN(`start_time`)']) {
      shiftHours = calcShiftLenghtInHourMinFormat(shifts.start_time, shifts.end_time);
    }

    return (
      <tr>
        <td> <RouteBusDisplay bus={shifts.bus_info_id} route={shifts.line_name} /> </td>
        <td> {convertMilitaryTime(shifts.start_time)} - {convertMilitaryTime(shifts.end_time)} </td>
        <td> {numOfRounds} </td>
        <td> {shiftHours} </td>

        <td style={{ display: this.props.modalStatus ? 'none' : 'block' }}> {statusIndicator} </td>
        <td>
          <Link to="/shifts/details/">
            <input type="button" className="btn btn-dark" style={{ display: this.props.modalStatus ? 'none' : 'block' }}
              value={shiftButton} onClick={this.openDetails} />
          </Link>
        </td>
      </tr>
    );
  }
}

export default SingleShift;
