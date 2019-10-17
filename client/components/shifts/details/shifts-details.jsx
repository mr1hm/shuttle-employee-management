import React from 'react';
import { Link } from 'react-router-dom';
import { createDateObjFromDateString, adjustLocalTimestampToUTCSeconds } from '../../../lib/time-functions';
import RouteBusDisplay from '../../route-bus-display';

class ShiftsDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shiftOverview: null,
      shiftDetails: null,
      checkedRounds: []
    };
    this.passCheckedRoundIds = this.passCheckedRoundIds.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  getShifts(query) {
    const { date, userId } = this.props;
    const response = fetch(`/api/shifts-day.php?date=${date}&userID=${userId}`);
    response
      .then(response => response.json())
      .then(json => {
        const shiftOverview = json.filter(shift => shift.roundID === this.props.shiftId);
        this.setState({ shiftOverview: shiftOverview[0] });
      })
      .then(() => { this.getShiftDetails(); })
      .catch(error => { console.error(error); });
  }
  getShiftDetails() {
    const { start_time, end_time, user_id } = this.state.shiftOverview;
    const { date } = this.props;
    const response = fetch(`/api/shifts-details.php?unixdate=${date}&start_time=${start_time}&end_time=${end_time}&user_id=${user_id}`);
    response
      .then(res => res.json())
      .then(json => this.setState({ shiftDetails: json }))
      .catch(error => console.error(error));
  }

  componentDidMount() {
    this.getShifts();
  }
  handleChange(e) {
    const { checkedRounds } = this.state;
    const { id } = e.currentTarget;
    if (checkedRounds.includes(id)) {
      checkedRounds.splice(checkedRounds.indexOf(id), 1);
    } else {
      checkedRounds.push(id);
    }
    this.setState({ checkedRounds: checkedRounds });

  }
  passCheckedRoundIds() { // callback method for post/trade/swap
    const shiftDetails = this.state.shiftDetails.filter(shift => this.state.checkedRounds.includes(shift.roundID));
    this.props.startSwapTradeTransaction(shiftDetails);
  }
  render() {
    if (!this.state.shiftDetails) {
      return (
        <div className="container mt-2">
          <div className="row">
            <div className="col">
              <h1>No Shift Details Available</h1>
            </div>
          </div>
        </div>);
    }
    const rounds = this.state.shiftDetails.map((shift, index) => {
      return (
        <tr key={shift.roundID}>
          <td>
            <div className="form-check">
              <input id={shift.roundID} className="form-check-input" type="checkbox" onChange={this.handleChange}/>
            </div>
          </td>
          <td>{shift.start_time}</td>
          <td>{shift.end_time}</td>
        </tr>
      );
    });
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h1>Shift Details</h1>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RouteBusDisplay route={this.state.shiftOverview.line_name} bus={this.state.shiftOverview.roundID}/>
          </div>
        </div>
        <div className="row">
          <div className="col text-center"><h5>Select the shifts you want to change</h5></div>
        </div>
        <div className="row">
          <div className="col">
            <table className="table table-bordered text-center">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Start</th>
                  <th scope="col">End</th>
                </tr>
              </thead>
              <tbody>
                {rounds}
              </tbody>
            </table>
          </div>
          <div className="col-2 d-flex flex-column justify-content-space-between">
            <button className="btn btn-primary mb-2">Post</button>
            <Link to='/trade-swap' className="btn btn-primary mb-2" onClick={this.passCheckedRoundIds}>Trade/Swap</Link>
            <button className="btn btn-primary">My Shifts</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ShiftsDetails;

/* ***
PUT IN POST MODAL
***
*/
// postShift(status, userID, roundID, transactionType) {
//   fetch('/api/driver-shift.php' + '?status=' + status + '&user_id=' + userID + '&id=' + roundID + '&transaction=' + transactionType, {
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     method: 'PATCH',
//     body: JSON.stringify({
//       status: status,
//       user_id: userID,
//       id: roundID,
//       transaction: transactionType
//     })
//   })
//     .then(response => {
//       this.props.dataDidUpdateCallback();
//       return response.json();
//     })
//     .catch(error => { throw (error); });
// }

// handleTransactionLog(event) {
//   let text = event.currentTarget.textContent;
//   let type = null;
//   switch (text) {
//     case 'Yes, I want to cancel':
//       type = 'cancel';
//       break;
//     case 'Yes, I want to post':
//       type = 'post';
//       break;
//   }
//   console.log('type', type);
//   fetch('/api/transaction.php', {
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({
//       text: this.state.textFromCommentBox,
//       user_id: this.props.userID,
//       bus_id: this.props.busNumber,
//       type: type
//     })
//   })
//     .then(response => {
//       console.log('transaction', response.json());
//     });
// }

// openModal(roundIDs) {
//   if (!Array.isArray(roundIDs)) {
//     roundIDs = [roundIDs];
//   }
//   let allShiftsToPass = [];
//   for (var roundIndex = 0; roundIndex < roundIDs.length; roundIndex++) {
//     let currentRound = parseInt(roundIDs[roundIndex]);
//     let shiftsToPass = this.state.shiftsDetailsInfo.filter(shift => (parseInt(shift.roundID) === currentRound));
//     allShiftsToPass = allShiftsToPass.concat(shiftsToPass);
//   }
//   this.setState({
//     isModalOpen: true,
//     roundID: parseInt(roundIDs),
//     shiftsDetailsInfo: allShiftsToPass
//   });
// }
