import React from 'react';
import './shifts-details.css';
import TopMenuGeneral from '../../topmenu/topmenu-general';
import RouteBusDisplay from '../../route-bus-display';
import {Grid} from '@material-ui/core';
import Modal from '../../post-modal';
import TradeSwap from '../../trade-swap-modal';
import ShiftsDay from '../../shifts/day/shifts-day';
import {OneOfMyShifts} from '../../shifts/day/shifts-day';
import { createDateObjFromDateString, adjustLocalTimestampToUTCSeconds} from '../../../lib/time-functions';


class ShiftsDetails extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        isModalOpen: false,
        shiftsDetailsInfo: [],
        textFromCommentBox:"",
        modalType:"",
        timeSpanOfShift:"",
        dateAndRoundString:""
      }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createSubHeaderTimeFrame = this.createSubHeaderTimeFrame.bind(this);
    this.postShift = this.postShift.bind(this);
    this.pushRoundIDsToArray = this.pushRoundIDsToArray.bind(this);
    this.handlePostButtonConfirmation = this.handlePostButtonConfirmation.bind(this);
    this.checkedRoundIDs = [];
    this.handleTransactionLog = this.handleTransactionLog.bind(this);
    this.handleTextArea = this.handleTextArea.bind(this);
    this.convertMilitaryTime = this.convertMilitaryTime.bind(this);
    this.createDate = this.createDate.bind(this);
  }

  handleTextArea(event){
    console.log("props in handleText",this.props.userID);
    console.log("props in handleText", this.props.busNumber);
    this.setState({ textFromCommentBox: event.target.value });
    console.log("text", this.state.textFromCommentBox);

  }

  handleTransactionLog(event){
    let text = event.currentTarget.textContent;
    let type = null;
    switch(text){
      case "Yes, I want to cancel":
        type = "cancel";
        break;
      case "Yes, I want to post":
        type = "post";
        break;
    };
    console.log("type",type);
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
       console.log("transaction",response.json());
      })
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
  postShift(status, userID, roundID, transactionType){
    fetch('/api/driver-shift.php' + '?status=' + status + '&user_id=' + userID + '&id=' + roundID + '&transaction=' + transactionType,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify({
        status: status,
        user_id: userID,
        id: roundID,
        transaction: transactionType
      })
    })
      .then(response => {
        this.props.dataDidUpdateCallback();
        return response.json();
      } )
      .catch(error => {throw(error)});
  }
  componentDidMount(){
    let date = createDateObjFromDateString(this.props.unixDate ? this.props.unixDate : 1560409200000).getTime();// converts unix time to date/at midnight 09/17/2019
    let shiftStart = this.props.blockStartTime ? this.props.blockStartTime : 600;
    let shiftEnd = this.props.blockEndTime ? this.props.blockEndTime : 1100;
    let user = this.props.userID ? this.props.userID : 17;
    const unixDateOfDay = `?unixdate=${adjustLocalTimestampToUTCSeconds(date)}`;
    const shiftBlockStartTime = `&start_time=${shiftStart}`;
    const shiftBlockEndTime = `&end_time=${shiftEnd}`;
    const userID = `&user_id=${user}`;
    const fullQuery = unixDateOfDay + shiftBlockStartTime + shiftBlockEndTime + userID;
    this.getData('/api/shifts-details.php' + fullQuery, 'GET');
  }

  openModal(roundIDs,modalType) {
    if(!Array.isArray(roundIDs)){
      roundIDs = [roundIDs];
    }
    let allShiftsToPass = [];
    for( var roundIndex = 0; roundIndex < roundIDs.length; roundIndex++){
      let currentRound = parseInt(roundIDs[roundIndex]);
      let shiftsToPass = this.state.shiftsDetailsInfo.filter(shift => (parseInt(shift.roundID) === currentRound));
      allShiftsToPass = allShiftsToPass.concat( shiftsToPass);
    }

    console.log("ShiftsToPass: ", allShiftsToPass);
    this.setState({
      isModalOpen: true,
      roundID: parseInt(roundIDs),
      shiftsDetailsInfo: allShiftsToPass,
      modalType:modalType
    })
    this.createSubHeaderTimeFrame();
  }

  closeModal() {
    this.setState({
      isModalOpen: false,
      view: "confirmShifts"
    })
    this.props.goBack();
  }

  pushRoundIDsToArray(number) {
    const index = this.checkedRoundIDs.findIndex(element => element === number); // findIndex returns index of matching element if it exists in array, otherwise returns -1.
    if (index < 0) {  // if index doesnt exist,
      this.checkedRoundIDs.push(number);  // push the element id into the array
    } else this.checkedRoundIDs.splice(index, 1);   // otherwise, the element is already in the array and clicking again must remove, so splicing.
  }
  handlePostButtonConfirmation() {
    this.checkedRoundIDs.map(element => {
      if (this.state.shiftsDetailsInfo[0].status === 'scheduled'){
        this.postShift('posted', this.props.userID, element, 'postShift')
      } else if (this.state.shiftsDetailsInfo[0].status === 'posted'){
        this.postShift('scheduled', this.props.userID, element, 'cancelPost')
      }
      })
    this.closeModal();
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
  createDate() {
    let date = new Date(createDateObjFromDateString(this.props.unixDate ? this.props.unixDate : 1560409200000).getTime());// converts unix time to date/at midnight
    const daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = date.getFullYear();
    const month = monthsArray[date.getMonth()];
    const calendarDate = date.getDate();
    const day = daysArray[date.getDay()];
    const fullDate = day + ", " + month + " " + calendarDate + ", " + year;
    return fullDate;
  }
  createSubHeaderTimeFrame() {
    const shiftDetails = this.state.shiftsDetailsInfo;
    const fullDate=this.createDate();
    if (shiftDetails.length !== 0) {
      const shiftDurationStart = shiftDetails[0].start_time;
      const shiftDurationEnd = shiftDetails[shiftDetails.length - 1].end_time;
      const timeSpanOfShift =  this.convertMilitaryTime(shiftDurationStart)+" - "+this.convertMilitaryTime(shiftDurationEnd);
      const dateAndRoundString = `${fullDate} | Rounds: ${shiftDetails.length}`;
      this.setState({
        timeSpanOfShift:timeSpanOfShift,
        dateAndRoundString:dateAndRoundString
      });
    }
  }
  renderSubHeaderTimeFrame() {
    const shiftDetails = this.state.shiftsDetailsInfo;
    const fullDate=this.createDate();
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
      <div className="custom-control custom-checkbox checkboxElements">
      <input
        type="checkbox"
        className="custom-control-input"
        id={object.roundID}
        onChange={() => this.pushRoundIDsToArray(object.roundID)}
        ></input>
      <label className="custom-control-label" htmlFor={object.roundID}></label>
    </div>
    );
  }
  render() {
    if (!this.state.shiftsDetailsInfo){
      return <div>No Shift Details Available</div>;
    }
    else if (this.state.modalType === "trade") {
      return (
      <>
          <TradeSwap roundArray={this.state.shiftsDetailsInfo} route={this.props.busLine[0]} busNumber={this.props.busNumber[0]}  timeSpan={this.state.timeSpanOfShift} dateAndRound={this.state.dateAndRoundString} close={this.closeModal}/>
      </>

      )
    }
    else {
      const shiftDetails = this.state.shiftsDetailsInfo;
      return (
        <React.Fragment>
          <TopMenuGeneral title="Shifts - DETAILS"/>
          <div className="details subHeader">
            <div className="busRouteIconContainer">
                <RouteBusDisplay route={this.props.busLine[0]} bus={this.props.busNumber[0]}/>
            </div>
            <div className="subHeaderInfoContainer">
              <div className="shiftTimeSpan">{this.state.timeSpanOfShift}</div>
              <div className="subHeaderDayAndRoundsInfo">{this.state.dateAndRoundString}</div>
            </div>
            {this.renderSubHeaderTimeFrame()}
              {/* {this.createSubHeaderTimeFrame()} */}
          </div>
          <div className="details mainContainer">
            <Grid container className="flex-section roundsListGrid">
              <Grid
                item
                xs={6}
                className={"flex-col-scroll scrollableContainer"}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-12 fullWidthGridColumn">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th></th>
                            {/* <div className="custom-control custom-checkbox checkboxElements">
                              <input type="checkbox" className="custom-control-input" id="customCheckT0"></input>
                              <label className="custom-control-label" htmlFor="customCheckT0">{""}</label>
                            </div> */}
                            <th scope="col">Start</th>
                            <th scope="col">End</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shiftDetails.map((object, index ) => { return (
                            <tr key={index}>
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
                className={"flex-col-scroll scrollableContainer"}
              >
                <div className="container inactive">
                  <div className="row">
                    <div className="col-12 fullWidthGridColumn">
                      <table className="table table-bordered">
                        <thead>
                          <tr>

                            {/* <th></th> */}
                            {/* <div className="custom-control custom-checkbox checkboxElements">
                              <input type="checkbox" className="custom-control-input" id="customCheckD0"></input>
                              <label className="custom-control-label" htmlFor="customCheckD0">{""}</label>
                            </div> */}
                            <th scope="col">Recurring Dates</th>
                          </tr>
                        </thead>
                        <tbody>

                          {/* {shiftDetails.map(shiftDate => {return (
                            <tr>
                              <td>
                              <div className="custom-control custom-checkbox checkboxElements">
                                <input type="checkbox" className="custom-control-input" id={shiftDate}></input>
                                <label className="custom-control-label" htmlFor={shiftDate}></label>
                              </div>
                              </td>
                              <td>{shiftDate}</td>
                            </tr>
                          )})} */}

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
            <div className="buttonContainer">
              <button type="button" className="btn btn-outline-dark btn-block" onClick={() => this.openModal(this.checkedRoundIDs,"post")}>
              {this.state.shiftsDetailsInfo[0] && this.state.shiftsDetailsInfo[0].status === 'posted' ? 'Cancel Post' : "Post" }</button>
              <button type="button" className="btn btn-outline-dark btn-block" onClick={() => this.openModal(this.checkedRoundIDs,"trade")}>Trade/Swap</button>
              <button type="button" className="btn btn-outline-dark btn-block" onClick={() => this.props.goBack()}>My Shifts</button>
            </div>
          </div>
          <Modal open={this.state.isModalOpen} status={this.state.activeModal} shiftStatus={this.state.shiftsDetailsInfo.status}>
            <h2> PLEASE CONFIRM: <br></br>
              {this.state.shiftsDetailsInfo[0] && this.state.shiftsDetailsInfo[0].status === 'posted'
                ? "Do you really want to cancel this/these post(s)?" : "Do you really want to post this/these shift(s)?"}</h2>
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
            <div className="form-group box">
              <label className="boxComment" htmlFor="comment ">Comment:</label>
              <textarea onChange={this.handleTextArea} className="form-control ml-3" rows="5" id="comment"></textarea>
            </div>
            <p><button className= "modalCancelButton btn-dark" onClick= {() => this.closeModal()}>Back to My Shifts</button></p>
            <p onClick={(event) => this.handleTransactionLog(event)} ><button className= "modalConfirmButton btn-primary" onClick={this.handlePostButtonConfirmation} >
              {this.state.shiftsDetailsInfo[0] && this.state.shiftsDetailsInfo[0].status === 'posted' ? 'Yes, I want to cancel' : "Yes, I want to post"}</button></p>
          </Modal>
        </React.Fragment>
    )}
  }
}

export default ShiftsDetails;
