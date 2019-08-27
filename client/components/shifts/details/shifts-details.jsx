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
            shiftsDetailsInfo: null
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
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
        this.getData('/api/dummy-data-shift-details-modal.json', 'GET');
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
        const shiftDuration = this.state.shiftsDetailsInfo.shiftDetails[0].shiftDuration;
        const startTime = shiftDuration.startTime;
        const endTime = shiftDuration.endTime;
        return (
            <div className="shiftTimeSpan">{this.convertMilitaryTime(startTime)} - {this.convertMilitaryTime(endTime)}</div>
        )
    }
    render() {
        if (!this.state.shiftsDetailsInfo){
            return <div>No Shift Details Available</div>;
        }
        const shiftDetails = this.state.shiftsDetailsInfo.shiftDetails[0];
        return (
            <React.Fragment>
                <TopMenuGeneral title="Shifts - DETAILS"/>
                <div className="details subHeader">
                    <div className="busRouteIconContainer">
                        <RouteBusDisplay bus={shiftDetails.busNum} route={shiftDetails.line}/>
                    </div>
                    <div className="subHeaderInfoContainer">
                        {this.createSubHeaderTimeFrame()}
                        <div className="recurringAndRoundCount">Every Tuesday Recurring | Rounds: {shiftDetails.numRounds}</div>
                    </div>
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
                                                {shiftDetails.shiftRounds.map(roundObject => {return (
                                                    <tr>
                                                        <td>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id={roundObject.startTime+roundObject.endTime}></input>
                                                            <label className="custom-control-label" htmlFor={roundObject.startTime+roundObject.endTime}></label>
                                                        </div>
                                                        </td>
                                                        <td>{this.convertMilitaryTime(roundObject.startTime)}</td>
                                                        <td>{this.convertMilitaryTime(roundObject.endTime)}</td>
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
                            <div className="container">
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
                                            {shiftDetails.shiftDates.map(shiftDate => {return (
                                                    <tr>
                                                        <td>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id={shiftDate}></input>
                                                            <label className="custom-control-label" htmlFor={shiftDate}></label>
                                                        </div>
                                                        </td>
                                                        <td>{shiftDate}</td>
                                                    </tr>
                                                )})}
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
                <Modal open={this.state.isModalOpen} status={this.state.activeModal} shiftStatus={this.state.shiftsDetailsInfo.status} >
          <h2> PLEASE CONFIRM: <br></br>Do you really want to post this shift?</h2>
          <p><button className= "modalCancelButton" onClick= {() => this.closeModal()}>Cancel</button></p>
          <p><button onClick={() => this.closeModal();
            this.setState(
                {
                    shiftDetailsInfo:{
                        status: "posted"
                    }
                }
            )
        }>Yes, I want to post</button></p>
        </Modal>
            </React.Fragment>
        )
    }
}

export default ShiftsDetails;
