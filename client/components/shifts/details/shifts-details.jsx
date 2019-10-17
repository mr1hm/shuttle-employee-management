import React from 'react';
import { createDateObjFromDateString, adjustLocalTimestampToUTCSeconds } from '../../../lib/time-functions';

class ShiftsDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shiftOverview: null,
      shiftDetails: null
    };
    this.checkedRoundIDs = [];
    this.createSubHeaderTimeFrame = this.createSubHeaderTimeFrame.bind(this);
    this.pushRoundIDsToArray = this.pushRoundIDsToArray.bind(this);
    this.passCheckedRoundIds = this.passCheckedRoundIds.bind(this);
  }
  handleTransactionLog(event) {
    let text = event.currentTarget.textContent;
    let type = null;
    switch (text) {
      case 'Yes, I want to cancel':
        type = 'cancel';
        break;
      case 'Yes, I want to post':
        type = 'post';
        break;
    }
    console.log('type', type);
    fetch('/api/transaction.php', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        text: this.state.textFromCommentBox,
        user_id: this.props.userID,
        bus_id: this.props.busNumber,
        type: type
      })
    })
      .then(response => {
        console.log('transaction', response.json());
      });
  }

  getData(url, methodToUse) {
    fetch(url, { method: methodToUse })
      .then(response => response.json())
      .then(details => this.setState({ shiftsDetailsInfo: details }))
      .catch(error => { throw (error); });
  }

  getShifts(query) {
    const response = fetch(`/api/shifts-day.php` + this.props.queryString, {
      method: 'GET'
    });

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
    const unixDate = 1566100800;
    const response = fetch(`/api/shifts-details.php?unixdate=${unixDate}&start_time=${start_time}&end_time=${end_time}&user_id=${user_id}`)
    ;
    response
      .then(res => res.json())
      .then(json => this.setState({ shiftDetails: json }))
      .catch(error => console.error(error));
  }
  componentDidMount() {
    this.getShifts();
  }

  openModal(roundIDs) {
    if (!Array.isArray(roundIDs)) {
      roundIDs = [roundIDs];
    }
    let allShiftsToPass = [];
    for (var roundIndex = 0; roundIndex < roundIDs.length; roundIndex++) {
      let currentRound = parseInt(roundIDs[roundIndex]);
      let shiftsToPass = this.state.shiftsDetailsInfo.filter(shift => (parseInt(shift.roundID) === currentRound));
      allShiftsToPass = allShiftsToPass.concat(shiftsToPass);
    }
    this.setState({
      isModalOpen: true,
      roundID: parseInt(roundIDs),
      shiftsDetailsInfo: allShiftsToPass
    });
  }
  pushRoundIDsToArray(number) {
    const index = this.checkedRoundIDs.findIndex(element => element === number); // findIndex returns index of matching element if it exists in array, otherwise returns -1.
    if (index < 0) { // if index doesnt exist,
      this.checkedRoundIDs.push(number); // push the element id into the array
    } else this.checkedRoundIDs.splice(index, 1); // otherwise, the element is already in the array and clicking again must remove, so splicing.
  }
  convertMilitaryTime(militaryTime) {
    if (militaryTime.length < 4) {
      militaryTime = '0' + militaryTime;
    }
    let hour = parseInt(militaryTime.slice(0, 2));
    const minute = militaryTime.slice(2);
    let meridiem;
    if (hour < 12) {
      meridiem = 'AM';
    } else {
      meridiem = 'PM';
      if (hour > 12) {
        hour -= 12;
      }
    }
    return hour + ':' + minute + ' ' + meridiem;
  }

  passCheckedRoundIds() { // callback method for post/trade/swap
    this.props.startSwapTradeTransaction(this.checkedRoundIDs);
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
              <input className="form-check-input" type="checkbox" />
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

          </div>
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
