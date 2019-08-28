import React from 'react';
import './shifts-details.css';
import TopMenuGeneral from '../../topmenu/topmenu-general';
import RouteBusDisplay from '../../route-bus-display';
import {Grid} from '@material-ui/core';
import Modal from '../../post-modal';

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
  componentDidMount(){
    let date = this.props.unixDate ? this.props.unixDate : 1560409200000;
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
  openModal() {
    this.setState({
      isModalOpen: true,
    })
  }
  closeModal() {
    this.setState({
      isModalOpen: false,
    })
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
    let date = this.props.unixDate ? new Date(this.props.unixDate) : new Date(1560409200000);
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
              <RouteBusDisplay bus={shiftDetails.busNum} route={shiftDetails.line}/>
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
                          <div></div>
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
                          <tr>
                            <td>
                            <div className="custom-control custom-checkbox">
                              <input type="checkbox" className="custom-control-input" id={object.date + object.start_time}></input>
                              <label className="custom-control-label" htmlFor={object.date + object.start_time}></label>
                            </div>
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
                          <div></div>
                          {/* <div className="custom-control custom-checkbox">
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
                            <div className="custom-control custom-checkbox">
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
            <button type="button" className="btn btn-outline-dark btn-block" onClick={this.openModal}>Post</button>
            <button type="button" className="btn btn-outline-dark btn-block">Trade/Swap</button>
            <button type="button" className="btn btn-outline-dark btn-block" onClick={() => this.props.goBack()}>My Shifts</button>
          </div>
        </div>
        <Modal open={this.state.isModalOpen} status={this.state.activeModal} shiftStatus={this.state.shiftsDetailsInfo.status}>
          <h2> PLEASE CONFIRM: <br></br>Do you really want to post this shift?</h2>
          <p><button className= "modalCancelButton" onClick= {() => this.closeModal()}>Cancel</button></p>
          <p><button onClick={() => this.closeModal()}>Yes, I want to post</button></p> {/* Need to make fetch call to hit driver-shift endpoint to switch shifts from scheduled to posted*/}
        </Modal>
      </React.Fragment>
    )
  }
}

export default ShiftsDetails;
