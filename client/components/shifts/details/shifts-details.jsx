import React from 'react';
import './shifts-details.css';
import TopMenuGeneral from '../../topmenu/topmenu-general';
import RouteBusDisplay from '../../route-bus-display';
import {Grid} from '@material-ui/core';
import Modal from '../../post-modal';
import ShiftsDay from '../../shifts/day/shifts-day';
import {OneOfMyShifts} from '../../shifts/day/shifts-day';
import {createDateObjFromDateString} from '../../../lib/time-functions';


class ShiftsDetails extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        isModalOpen: false,
        shiftsDetailsInfo: []
      }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createSubHeaderTimeFrame = this.createSubHeaderTimeFrame.bind(this);
    this.postShift = this.postShift.bind(this);
    this.pushRoundIDsToArray = this.pushRoundIDsToArray.bind(this);
    this.handlePostButtonConfirmation = this.handlePostButtonConfirmation.bind(this);
    this.checkedRoundIDs = [];
  }
  getData(url, methodToUse) {
    fetch(url, { method: methodToUse })
      .then(response => { return response.json() })
      .then(details => {
        this.setState({
          shiftsDetailsInfo: details
        })
      })
      .catch(error => {throw(error)});
  }
  postShift(status, userID, roundID){
    fetch('/api/driver-shift.php' + '?status=' + status + '&user_id=' + userID + '&id=' + roundID,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify({
        status: status,
        user_id: userID,
        id: roundID})
    })
      .then(response => { return response.json()} )
      .catch(error => {throw(error)});
  }
  componentDidMount(){
    let date = createDateObjFromDateString(this.props.unixDate ? this.props.unixDate : 1560409200000).getTime();
    let shiftStart = this.props.blockStartTime ? this.props.blockStartTime : 600;
    let shiftEnd = this.props.blockEndTime ? this.props.blockEndTime : 1100;
    let user = this.props.userID ? this.props.userID : 1;
    const unixDateOfDay = `?unixdate=${date}`;
    const shiftBlockStartTime = `&start_time=${shiftStart}`;
    const shiftBlockEndTime = `&end_time=${shiftEnd}`;
    const userID = `&user_id=${user}`;
    const fullQuery = unixDateOfDay + shiftBlockStartTime + shiftBlockEndTime + userID;
    this.getData('/api/shifts-details.php' + fullQuery, 'GET');
  }

  openModal(roundIDs) {
    let shiftsToPass = this.state.shiftsDetailsInfo.filter(shift => (parseInt(shift.id) === parseInt(roundIDs)));
    console.log("ShiftsToPass: ", shiftsToPass);
    this.setState({
      isModalOpen: true,
      roundID: parseInt(roundIDs),
      shiftsDetailsInfo: shiftsToPass

    })
  }
  closeModal() {
    this.setState({
      isModalOpen: false,
    })
  }

  pushRoundIDsToArray(number) {
    const index = this.checkedRoundIDs.findIndex(element => element === number); // findIndex returns index of matching element if it exists in array, otherwise returns -1.
    if (index < 0) {  // if index doesnt exist,
      this.checkedRoundIDs.push(number);  // push the element id into the array
    } else this.checkedRoundIDs.splice(index, 1);   // otherwise, the element is already in the array and clicking again must remove, so splicing.
  }
  handlePostButtonConfirmation() {
    this.checkedRoundIDs.map(element => this.postShift('posted', this.props.userID, element))
    this.closeModal()
    this.props.goBack()
  }
  convertMilitaryTime(militaryTime) {
    if (militaryTime.length < 4){
      militaryTime = "0" + militaryTime;
    }
    let hour = parseInt(militaryTime.slice(0,2));
    const minute = militaryTime.slice(2);
    let meridiem;
    if (hour < 12) {
      meridiem = "AM";
    } else {
      meridiem = "PM";
      if (hour > 12) {
        hour -= 12;
      }
    }
    return hour + ":" + minute + " " + meridiem;
  }
  createSubHeaderTimeFrame() {
    const shiftDetails = this.state.shiftsDetailsInfo;
    let date = new Date(createDateObjFromDateString(this.props.unixDate ? this.props.unixDate : 1560409200000).getTime());
    const daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const year = date.getFullYear();
    const month = monthsArray[date.getMonth()];
    const calendarDate = date.getDate();
    const day = daysArray[date.getDay()];
    const fullDate = day + ", " + month + " " + calendarDate + ", " + year;
    if (shiftDetails.length !== 0) {
      const shiftDurationStart = shiftDetails[0].start_time;
      const shiftDurationEnd = shiftDetails[shiftDetails.length - 1].end_time;
      return (
        <div className="subHeaderInfoContainer">
          <div className="shiftTimeSpan">{this.convertMilitaryTime(shiftDurationStart)} - {this.convertMilitaryTime(shiftDurationEnd)}</div>
          <div className="subHeaderDayAndRoundsInfo">{fullDate} | Rounds: {shiftDetails.length}</div>
        </div>
      );
    }
  }
  generateCheckboxElements(object) {
    return (
      <div className="custom-control custom-checkbox">
      <input
        type="checkbox"
        className="custom-control-input"
        id={object.id}
        onChange={() => this.pushRoundIDsToArray(object.id)}
        ></input>
      <label className="custom-control-label" htmlFor={object.id}></label>
    </div>
    );
  }
  render() {
    if (!this.state.shiftsDetailsInfo){
      return <div>No Shift Details Available</div>;
    }
    const shiftDetails = this.state.shiftsDetailsInfo;
    return (
      <React.Fragment>
        <TopMenuGeneral title="Shifts - DETAILS"/>
        <div className="details subHeader">
          <div className="busRouteIconContainer">
              <RouteBusDisplay route={this.props.busLine} bus={this.props.busNumber}/>
          </div>
            {this.createSubHeaderTimeFrame()}
        </div>
        <div className="details mainContainer">
          <Grid container className="flex-section">
            <Grid
              item
              xs={6}
              className={"flex-col-scroll"}
            >
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th></th>
                          {/* <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="customCheckT0"></input>
                            <label className="custom-control-label" htmlFor="customCheckT0">{""}</label>
                          </div> */}
                          <th scope="col">Start</th>
                          <th scope="col">End</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shiftDetails.map(object => { return (
                          <tr key={object.id}>
                            <td>
                            {this.generateCheckboxElements(object)}
                            </td>
                            <td>{this.convertMilitaryTime(object.start_time)}</td>
                            <td>{this.convertMilitaryTime(object.end_time)}</td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid
              item
              xs={6}
              className={"flex-col-scroll"}
            >
              <div className="container inactive">
                <div className="row">
                  <div className="col-12">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">Recurring Dates</th>
                        </tr>
                      </thead>
                      <tbody>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
          <div className="buttonContainer">
            <button type="button" className="btn btn-outline-dark btn-block" onClick={() => this.openModal(this.checkedRoundIDs)}>Post</button>
            <button type="button" className="btn btn-outline-dark btn-block">Trade/Swap</button>
            <button type="button" className="btn btn-outline-dark btn-block" onClick={() => this.props.goBack()}>My Shifts</button>
          </div>
        </div>
        <Modal open={this.state.isModalOpen} status={this.state.activeModal} shiftStatus={this.state.shiftsDetailsInfo.status}>
          <h2> PLEASE CONFIRM: <br></br>Do you really want to post this/these shift(s)?</h2>
          <table className='table table-striped'>
            <tbody>
              {
                this.state.shiftsDetailsInfo.map((shifts, index) => {

                  return (

                    < OneOfMyShifts
                      key={index}
                      shifts={shifts}
                      openDetails={this.openModal}
                      view={this.props.view}
                      modalStatus={this.state.isModalOpen}
                      defaultDate= { this.props.unixDate }

                    />
                  );
                })
              }
            </tbody>
          </table>
          <p><button className= "modalCancelButton btn-dark" onClick= {() => this.closeModal()}>Cancel</button></p>
          <p><button className= "modalConfirmButton btn-primary" onClick={this.handlePostButtonConfirmation} >Yes, I want to post</button></p>
        </Modal>
      </React.Fragment>
    )
  }
}

export default ShiftsDetails;
