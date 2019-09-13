import React from 'react';
import { Link } from 'react-router-dom';
import { calcShiftLenghtInHourMinFormat } from '../../../lib/time-functions';
import TopMenuShift from '../../topmenu/topmenu-shift';
import Modal from '../../post-modal';
import RouteBusDisplay from '../../route-bus-display';
import ShiftsDetails from '../details/shifts-details';
import ShiftsAvailable from '../available/shifts-available';
import { createDateObjFromDateString } from '../../../lib/time-functions';
import { Minimatch } from 'minimatch';


function convertUnixMonthDay(time) {
  const getTheDate = new Date(time);
  const dateString = getTheDate.getFullYear() + '-' + ('0' + getTheDate.getDate()).slice(-2)
    + '-' + ('0' + (getTheDate.getMonth() + 1)).slice(-2);
  return dateString;
}

export function OneOfMyShifts(props) {
  let shiftButton = (props.shifts.status === 'posted' && props.view === 'myShifts') ? "Cancel Post" : "Details";
  // let statusColor = (props.shifts.status === 'posted') ? "border border-warning" : "border border-primary";
  let shiftHours = calcShiftLenghtInHourMinFormat(props.shifts["MIN(`start_time`)"], props.shifts["MAX(`end_time`)"]);
  let statusIndicator = (parseInt(props.shifts["COUNT(DISTINCT rd.`status`)"]) > 1) ? "Scheduled/Posted" : props.shifts.status;
  let numOfRounds = props.shifts["COUNT(`start_time`)"];
  if (props.view === 'availableShifts'){
     shiftButton = "Take Shift";
     shiftHours = calcShiftLenghtInHourMinFormat(props.shifts.start_time, props.shifts.end_time);
     statusIndicator = props.shifts.status;
     numOfRounds = 1; /*can work on changing this dynamically if needed.  Thought that it would be okay to just hardcode it
                      since this view shows the rounds broken up, so they would be 1*/
  }

  return (
    <tr>
      {/* <td> {props.shifts.line_name} / {props.shifts.bus_info_id} </td> */}
      <td> <RouteBusDisplay bus={props.shifts.bus_info_id} route={props.shifts.line_name} /> </td>

      <td> {props.shifts["MIN(`start_time`)"] || props.shifts.start_time} - {props.shifts["MAX(`end_time`)"] || props.shifts.end_time} </td>
      <td> {numOfRounds} </td>
      {/* <td> {calculateDailyWorkingHours(props.shifts.startTime, props.shifts.endTime)} </td> */}
      <td> {shiftHours} </td>

      <td /*className={statusColor}*/ style={{ display: props.modalStatus ? 'none' : 'block' }}> {statusIndicator} </td>
      <td> <input type="button" className="btn btn-dark" style={{ display: props.modalStatus ? 'none' : 'block' }}
          value={shiftButton} onClick={() => props.openDetails(props.shifts.roundID || props.shifts.id)} />
     </td>
    </tr>
  )
}

class ShiftsDay extends React.Component {
  constructor(props) {
    super(props);
    this.query = ``;
    this.fetchCallMethod = this.fetchCallMethod.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    const defaultDate = this.props.match.params.date ? createDateObjFromDateString(this.props.match.params.date).getTime() : parseInt(this.props.defaultDate );
    this.state = {
      myShiftsToday: [],
      isModalOpen: false,
      queryString: `?date=${defaultDate}&type=${this.props.view || 'myShifts'}`,
      dateToPass:  defaultDate,
      roundID: null,
      shiftsToPass: [],


    }
  }
  fetchCallMethod(query) {
    fetch(`/api/shifts-day.php` + query, {
      method: 'GET'
    })
      .then(response => {
        return response.json()
      })
      .then(myJson => {
        // if(myJson.success===false){
        //   console.log('error: ' + myJson.error);
        //   return false;
        // }
        this.setState({
          myShiftsToday: myJson
        })
      })
      .catch(error => { throw (error) });
  }
  componentDidMount() {
    this.fetchCallMethod(this.state.queryString);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log( "prevProps: ", prevProps);
    // console.log("prevState: " , prevState);
    if (prevProps.match.params.date !== this.props.match.params.date || this.props.view !== prevProps.view) {
      let dateToQuery = createDateObjFromDateString( (this.props.match.params.date ? this.props.match.params.date : this.state.dateToPass )).getTime();
      //dateToQuery += 25200000; //need to convert this, this is +7 hours for showing accurate time in Pacific Time
      //this shouldn't happen here because the backend expects things to be at midnight, not offset.  if any offset would be used
      //it would be in the display of the time, not the passing of the time, at least with the present system.
      this.setState({
        dateToQuery: dateToQuery,
        queryString: `?date=${dateToQuery}&type=${this.props.view || 'myShifts'}`,
        dateToPass: this.props.match.params.date
      })
      console.log(`update query string ?date=${dateToQuery}&type=${this.props.view || 'myShifts'}`)
      this.fetchCallMethod(`?date=${dateToQuery}&type=${this.props.view || 'myShifts'}`);
      // commented out: this.fetchCallMethod('?date=' + this.props.defaultDate);
    }
  }
  // openModal() {

  //   this.setState({
  //     isModalOpen: true,
  //     view: "availableShifts",
  //     roundID: null


  //   })

  // }
  openModal(roundID) {
    let shiftsToPass = this.state.myShiftsToday.filter(shift => (shift.roundID === roundID || shift.id === roundID));
    console.log("ShiftsToPass: ", shiftsToPass);
    this.setState({
      isModalOpen: true,
      view: "availableShifts",
      roundID: parseInt(roundID),
      shiftsToPass: shiftsToPass

    })

  }
  closeModal() {
    this.setState({
      isModalOpen: false,
      view: "myShifts",
      roundID: null,
    })

  }
  closeTakeShiftsModal() {
    let updatedShifts = this.state.myShiftsToday.filter(shift => (shift.roundID != this.state.roundID));
    this.setState({
      isModalOpen: false,
      view: "myShifts",
      roundID: null,
      myShiftsToday: updatedShifts

    })

  }
  handleTakeShift(status, userID, roundID) {
    fetch('/api/driver-shift.php' + '?status=' + status + '&user_id=' + userID + '&id=' + roundID, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify({
        status: status,
        user_id: userID,
        id: roundID
      })
    })
      .then(response => { return console.log("Patch response: ", response.json())  })
      .catch(error => { throw (error) });

      this.closeTakeShiftsModal();

  }


  render() {
    let dateToPass = this.state.dateToPass;
    dateToPass = createDateObjFromDateString(dateToPass);

    if (this.state.myShiftsToday.length === 0) {
      return (
        <div>
          <TopMenuShift title="DAY" page='day' date={dateToPass} />
          <div>You have no shifts scheduled today.</div>
        </div>
      );
    }

    let shiftBlockStart = this.state.shiftsToPass.map(index => index["MIN(`start_time`)"] || index.start_time).toString();
    let shiftBlockEnd = this.state.shiftsToPass.map(index => index["MAX(`end_time`)"] || index.end_time).toString();
    let shiftUserId = this.state.shiftsToPass.map(index => index.user_id).toString();
    let shiftBusLine = this.state.shiftsToPass.map(index => index.line_name).toString();
    let shiftBusNum = this.state.shiftsToPass.map(index => index.bus_info_id).toString();
    let shiftRoundID = this.state.shiftsToPass.map(roundID => roundID.roundID);



    if (this.props.view === "myShifts"){
      return (

      <div>

        <div><Link to={`/shifts/day/shifts-day/${convertUnixMonthDay(this.state.dateToPass)}`}> </Link></div>
        <TopMenuShift title={this.props.view === 'myShifts' ? "DAY" : "AVAILABLE"} page='day' date={(dateToPass)} />

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
                  < OneOfMyShifts
                    key={index}
                    shifts={shifts}
                    openDetails={this.openModal}
                    view = {this.props.view}
                    modalStatus= {this.state.isModalOpen}

                  />
                );
              })
            }
          </tbody>
        </table>
        <Modal open={this.state.isModalOpen} className="modalShiftDetails" view={this.state.view}>
            <ShiftsDetails
              goBack={this.closeModal}
              unixDate={this.props.match.params.date}
              blockStartTime={shiftBlockStart}   // the start time (military 4-digit) of the first round in the block clicked
              blockEndTime={shiftBlockEnd}      // the end time (military 4-digit) of the last round of the block clicked
              userID={shiftUserId[0]}           // the user's ID number (used the specific 0 index because the user id should be the same for all of these shifts on the details)
              busLine={shiftBusLine}          // the letter representing the line (route) of the selected round or block
              busNumber={shiftBusNum}        // the number of the bus for the selected round or block
            >
            </ShiftsDetails>
        </Modal>

      </div>
    );
    } else {
      return (

        <div>

          <div><Link to={`/shifts/day/shifts-day/${convertUnixMonthDay(this.state.dateToPass)}`}> </Link></div>
          <TopMenuShift title={this.props.view === 'myShifts' ? "DAY" : "AVAILABLE"} page='day' date={(dateToPass)} />

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
                    < OneOfMyShifts
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

          <Modal open={this.state.isModalOpen} className="modalShiftDetails" view={this.state.view} modalStatus={this.state.isModalOpen}>
            <h2> PLEASE CONFIRM: <br></br>Do you really want to TAKE this shift?</h2>
            <table className='table table-striped'>
              <tbody>
                {
                  this.state.shiftsToPass.map((shifts, index) => {

                    return (

                      < OneOfMyShifts
                        key={index}
                        shifts={shifts}
                        openDetails={this.openModal}
                        view={this.props.view}
                        modalStatus={this.state.isModalOpen}
                        defaultDate = { this.props.match.params.date }
                      />
                    );
                  })
                }
              </tbody>
            </table>

            {/* <h3 className="shiftToTake"> D2   740-800   1round   20m  </h3> */}
            <p><button className="modalCancelButton btn-dark" onClick={() => this.closeModal()}>Cancel</button></p>
            <p><button className="modalConfirmButton btn-primary" onClick={() => { this.handleTakeShift("scheduled", 1, this.state.roundID)}}>Yes, I want to TAKE this shift</button></p>
          </Modal>

        </div>
      );
    }

  }
}

export default ShiftsDay;
