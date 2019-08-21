import React from 'react';
import './shifts-details.css';
import { Link } from 'react-router-dom';
import TopMenuShift from '../../topmenu/topmenu-shift';
import TopMenuGeneral from '../../topmenu/topmenu-general';
import RouteBusDisplay from '../../route-bus-display';
import {createDateObjFromDateString} from '../../../lib/time-functions';
import {Grid} from '@material-ui/core';

class ShiftsDetails extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        // if (this.props.match.params.date === undefined) {
        //     var dateToPass = this.props.defaultDate;
        // } else {
        //     dateToPass = createDateObjFromDateString( this.props.match.params.date );
        //     dateToPass = dateToPass.getTime();
        // }
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
                            <div class="container">
                                <div class="row">
                                    <div class="col-12">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckT0"></input>
                                                        <label class="custom-control-label" for="customCheckT0">{""}</label>
                                                    </div>
                                                    <th scope="col">Start</th>
                                                    <th scope="col">End</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckT1"></input>
                                                        <label class="custom-control-label" for="customCheckT1"></label>
                                                    </div>
                                                    </td>
                                                    <td>6:30 AM</td>
                                                    <td>6:45 AM</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckT2"></input>
                                                        <label class="custom-control-label" for="customCheckT2">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>6:45 AM</td>
                                                    <td>7:00 AM</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckT3"></input>
                                                        <label class="custom-control-label" for="customCheckT3">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>7:00 AM</td>
                                                    <td>7:15 AM</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckT4"></input>
                                                        <label class="custom-control-label" for="customCheckT4">{""}</label>
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
                            <div class="container">
                                <div class="row">
                                    <div class="col-12">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckD0"></input>
                                                        <label class="custom-control-label" for="customCheckD0">{""}</label>
                                                    </div>
                                                    <th scope="col">Dates</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckD1"></input>
                                                        <label class="custom-control-label" for="customCheckD1"></label>
                                                    </div>
                                                    </td>
                                                    <td>07/23/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckD2"></input>
                                                        <label class="custom-control-label" for="customCheckD2">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>07/30/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckD3"></input>
                                                        <label class="custom-control-label" for="customCheckD3">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>08/06/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckD4"></input>
                                                        <label class="custom-control-label" for="customCheckD4">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>08/13/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckD5"></input>
                                                        <label class="custom-control-label" for="customCheckD5">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>08/20/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckD6"></input>
                                                        <label class="custom-control-label" for="customCheckD6">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>08/27/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckD7"></input>
                                                        <label class="custom-control-label" for="customCheckD7">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>09/03/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheckD8"></input>
                                                        <label class="custom-control-label" for="customCheckD8">{""}</label>
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
                        <button type="button" class="btn btn-outline-dark btn-block">Post</button>
                        <button type="button" class="btn btn-outline-dark btn-block">Trade/Swap</button>
                        <button type="button" class="btn btn-outline-dark btn-block">My Shifts</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ShiftsDetails;
