import React from 'react';
import { Link } from 'react-router-dom';
import {
  createDateObjFromDateString,
  convertUnixMonthDay,
  adjustLocalTimestampToUTCSeconds
} from '../../../lib/time-functions';
import TopMenuShift from '../../topmenu/topmenu-shift';
import Modal from '../../post-modal';
import ShiftsDetails from '../details/shifts-details';
import ShiftsAvailable from '../available/shifts-available';
import SingleShift from './single-shift';
import { Minimatch } from 'minimatch';

class ShiftsDay extends React.Component {
  constructor(props) {
    super(props);
    this.query = ``;
    this.dataDidUpdate = this.dataDidUpdate.bind(this);
    const defaultDate = this.props.match.params.date ? createDateObjFromDateString(this.props.match.params.date).getTime() : parseInt(this.props.defaultDate);// converts unix time to date/at midnight 09/17/2019
    const defaultId = this.props.userId;
    this.state = {
      myShiftsToday: [],
      isModalOpen: false,
      queryString: `?date=${adjustLocalTimestampToUTCSeconds(defaultDate)}&userID=${defaultId}&type=${this.props.view || 'myShifts'}`,
      dateToPass: defaultDate,
      roundID: null,
      shiftsToPass: [],
      userId: this.props.userId,
      postModal: false
    };
  }
  getShifts(query) {
    const response = fetch(`/api/shifts-day.php` + query, {
      method: 'GET'
    });

    response
      .then(response => response.json())
      .then(myJson => this.setState({ myShiftsToday: myJson }))
      .catch(error => { console.error(error); });
  }
  componentDidMount() {
    this.getShifts(this.state.queryString);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.date !== this.props.match.params.date || this.props.view !== prevProps.view) {
      let dateToQuery = createDateObjFromDateString((this.props.match.params.date ? this.props.match.params.date : this.state.dateToPass)).getTime();// converts unix time to date/at midnight 09/17/2019
      // dateToQuery += 25200000; //need to convert this, this is +7 hours for showing accurate time in Pacific Time
      // this shouldn't happen here because the backend expects things to be at midnight, not offset.  if any offset would be used
      // it would be in the display of the time, not the passing of the time, at least with the present system.
      this.setState({
        dateToQuery: adjustLocalTimestampToUTCSeconds(dateToQuery),
        queryString: `?date=${adjustLocalTimestampToUTCSeconds(dateToQuery)}&userID=${this.state.userId}&type=${this.props.view || 'myShifts'}`,
        dateToPass: this.props.match.params.date
      });
      this.getShifts(`?date=${adjustLocalTimestampToUTCSeconds(dateToQuery)}&userID=${this.state.userId}&type=${this.props.view || 'myShifts'}`);
    }
  }
  dataDidUpdate() {
    this.getShifts(this.state.queryString);
  }
  render() {
    let dateToPass = this.state.dateToPass;
    dateToPass = createDateObjFromDateString(dateToPass);// converts unix time to date/at midnight 09/17/2019

    if (this.state.myShiftsToday.length === 0) {
      if (this.props.view === 'availableShifts') {
        return (
          <div>
            <TopMenuShift title="AVAILABLE" page='day' date={dateToPass} />
            <div>There are no available shifts for you today.</div>
          </div>
        );
      } else {
        return (
          <div>
            <TopMenuShift title="DAY" page='day' date={dateToPass} />
            <div>You have no shifts scheduled today.</div>
          </div>
        );
      }

    }
    if (this.props.view === 'myShifts') {
      return (
        <>
          <div><Link to={`/shifts/day/shifts-day/${convertUnixMonthDay(this.state.dateToPass)}`}> </Link></div>
          <TopMenuShift title={this.props.view === 'myShifts' ? 'DAY' : 'AVAILABLE'} page='day' date={(dateToPass)} />
          <table className='table table-striped'>
            <thead>
              <tr>
                <td>Line/#</td>
                <td>Start-End</td>
                <td>Rounds</td>
                <td>Shift Hours</td>
                <td>Post Status</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {
                this.state.myShiftsToday.map((shifts, index) => {
                  return (
                    < SingleShift
                      key={index}
                      shifts={shifts}
                      openDetails={this.openModal}
                      view = {this.props.view}
                      modalStatus= {this.state.isModalOpen}
                      openRouteDetails={this.props.openRouteDetails}
                    />
                  );
                })
              }
            </tbody>
          </table>
        </>
      );
    } else {
      return (
        <div>
          <div><Link to={`/shifts/day/shifts-day/${convertUnixMonthDay(this.state.dateToPass)}`}> </Link></div>
          <TopMenuShift title={this.props.view === 'myShifts' ? 'DAY' : 'AVAILABLE'} page='day' date={(dateToPass)} />
          <table className='table table-striped'>
            <thead>
              <tr>
                <td>Line/#</td>
                <td>Start-End</td>
                <td>Rounds</td>
                <td>Shift Hours</td>
                <td>Post Status</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {
                this.state.myShiftsToday.map((shifts, index) => {
                  return (
                    < SingleShift
                      key={index}
                      shifts={shifts}
                      openDetails={this.openModal}
                      view={this.props.view}
                      modalStatus={this.state.isModalOpen}
                      defaultDate= { this.props.match.params.date }
                    />
                  );
                })
              }
            </tbody>
          </table>
        </div>
      );
    }

  }
}

export default ShiftsDay;

/*
***
HANDLE IN SHIFT DETAILS COMPONENT
***
*/
// let shiftBlockStart = this.state.shiftsToPass.map(index => index.start_time).toString();
// let shiftBlockEnd = this.state.shiftsToPass.map(index => index.end_time).toString();
// let shiftUserId = this.state.shiftsToPass.map(index => index.user_id);
// let shiftBusLine = this.state.shiftsToPass.map(index => index.line_name);
// let shiftBusNum = this.state.shiftsToPass.map(index => index.bus_info_id).toString();
// let shiftRoundID = this.state.shiftsToPass.map(roundID => roundID.roundID);
// <Modal open={this.state.isModalOpen} className="modalShiftDetails" view={this.state.view}>
//   <ShiftsDetails
//     dataDidUpdateCallback={this.dataDidUpdate}
//     goBack={this.closeModal}
//     unixDate={this.props.match.params.date}
//     blockStartTime={shiftBlockStart} // the start time (military 4-digit) of the first round in the block clicked
//     blockEndTime={shiftBlockEnd} // the end time (military 4-digit) of the last round of the block clicked
//     userID={shiftUserId[0]} // the user's ID number (used the specific 0 index because the user id should be the same for all of these shifts on the details)
//     busLine={shiftBusLine} // the letter representing the line (route) of the selected round or block
//     busNumber={shiftBusNum} // the number of the bus for the selected round or block
//   >
//   </ShiftsDetails>
// </Modal>

/*
***
HANDLE IN TRADE/SWAP COMPONENT
***
*/
// <Modal open={this.state.isModalOpen} className="modalShiftDetails" view={this.state.view} modalStatus={this.state.isModalOpen}>
//   <h2> PLEASE CONFIRM: <br></br>Do you really want to TAKE this shift?</h2>
//   <table className='table table-striped'>
//     <tbody>
//       {
//         this.state.shiftsToPass.map((shifts, index) => {
//           return (
//             < OneOfMyShifts
//               key={index}
//               shifts={shifts}
//               openDetails={this.openModal}
//               view={this.props.view}
//               modalStatus={this.state.isModalOpen}
//               defaultDate={this.props.match.params.date}
//             />
//           );
//         })
//       }
//     </tbody>
//   </table>
//   <p><button className="modalCancelButton btn-dark" onClick={() => this.closeModal()}>Cancel</button></p>
//   <p><button className="modalConfirmButton btn-primary" onClick={() => { this.handleTakeShift('scheduled', this.state.userId, this.state.roundID, 'claimShift'); }}>Yes, I want to TAKE this shift</button></p>
// </Modal>

/* ***

MOVE TO TRADE SWAP COMPONENT

*** */

// closeTakeShiftsModal() {
//   let updatedShifts = this.state.myShiftsToday.filter(shift => (shift.roundID != this.state.roundID));
//   this.setState({
//     isModalOpen: false,
//     view: 'myShifts',
//     roundID: null,
//     myShiftsToday: updatedShifts
//   });
// }
// handleTakeShift(status, userID, roundID, transactionType) {
//   const response = fetch('/api/driver-shift.php' + '?status=' + status + '&user_id=' + userID + '&id=' + roundID + '&transaction=' + transactionType, {
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
//   });

//   response
//     .then(response => { return console.log('Patch response: ', response.json()); })
//     .catch(error => { throw (error); });
//   this.closeTakeShiftsModal();

// }
