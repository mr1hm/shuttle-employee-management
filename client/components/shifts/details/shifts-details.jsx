import React from 'react';
import './shifts-details.css';
import { Link } from 'react-router-dom';
import TopMenuShift from '../../topmenu/topmenu-shift';
import TopMenuGeneral from '../../topmenu/topmenu-general';
import RouteBusDisplay from '../../route-bus-display';
import {createDateObjFromDateString} from '../../../lib/time-functions';
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
        this.getData('/api/dummy-data/shift-detail.json', 'GET');
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
    render() {
        // if (this.props.match.params.date === undefined) {
        //     var dateToPass = this.props.defaultDate;
        // } else {
        //     dateToPass = createDateObjFromDateString( this.props.match.params.date );
        //     dateToPass = dateToPass.getTime();
        // }
        if (!this.state.shiftsDetailsInfo){
            return <div>No Shift Details Available</div>;
        }
        return (
            <React.Fragment>
                {/* <TopMenuShift title="DETAILS" page='details' date={dateToPass}/> */}
                <TopMenuGeneral title="Shifts - DETAILS"/>
                <div className="details subHeader">
                    <div className="busRouteIconContainer">
                        <RouteBusDisplay bus='1' route='H'/>
                    </div>
                    <div className="subHeaderInfoContainer">
                        <div className="shiftTimeSpan">6:30 AM - 7:30 AM</div>
                        <div className="recurringAndRoundCount">Every Tuesday Recurring | Rounds: 4</div>
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
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckT0"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckT0">{""}</label>
                                                    </div>
                                                    <th scope="col">Start</th>
                                                    <th scope="col">End</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckT1"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckT1"></label>
                                                    </div>
                                                    </td>
                                                    <td>6:30 AM</td>
                                                    <td>6:45 AM</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckT2"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckT2">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>6:45 AM</td>
                                                    <td>7:00 AM</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckT3"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckT3">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>7:00 AM</td>
                                                    <td>7:15 AM</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckT4"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckT4">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>7:15 AM</td>
                                                    <td>7:30 AM</td>
                                                </tr>
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
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckD0"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckD0">{""}</label>
                                                    </div>
                                                    <th scope="col">Dates</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckD1"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckD1"></label>
                                                    </div>
                                                    </td>
                                                    <td>07/23/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckD2"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckD2">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>07/30/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckD3"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckD3">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>08/06/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckD4"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckD4">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>08/13/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckD5"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckD5">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>08/20/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckD6"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckD6">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>08/27/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckD7"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckD7">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>09/03/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="customCheckD8"></input>
                                                        <label className="custom-control-label" htmlFor="customCheckD8">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>09/10/2019</td>
                                                </tr>
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
                <Modal open={this.state.isModalOpen} status={this.state.activeModal}>
          <h2> PLEASE CONFIRM: <br></br>Do you really want to post this shift?</h2>
          <p><button className= "modalCancelButton" onClick= {() => this.closeModal()}>Cancel</button></p>
          <p><button onClick={() => this.closeModal()}>Yes, I want to post</button></p>
        </Modal>
            </React.Fragment>
        )
    }
}

export default ShiftsDetails;
