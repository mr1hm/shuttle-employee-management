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
                                                        <input type="checkbox" class="custom-control-input" id="customCheck0"></input>
                                                        <label class="custom-control-label" for="customCheck0">{""}</label>
                                                    </div>
                                                    <th scope="col">Start</th>
                                                    <th scope="col">End</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheck1"></input>
                                                        <label class="custom-control-label" for="customCheck1"></label>
                                                    </div>
                                                    </td>
                                                    <td>6:30 AM</td>
                                                    <td>6:45 AM</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheck2"></input>
                                                        <label class="custom-control-label" for="customCheck2">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>6:45 AM</td>
                                                    <td>7:00 AM</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheck3"></input>
                                                        <label class="custom-control-label" for="customCheck3">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>7:00 AM</td>
                                                    <td>7:15 AM</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheck4"></input>
                                                        <label class="custom-control-label" for="customCheck4">{""}</label>
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
                                                        <input type="checkbox" class="custom-control-input" id="customCheck0"></input>
                                                        <label class="custom-control-label" for="customCheck0">{""}</label>
                                                    </div>
                                                    <th scope="col">Dates</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheck1"></input>
                                                        <label class="custom-control-label" for="customCheck1"></label>
                                                    </div>
                                                    </td>
                                                    <td>07/23/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheck2"></input>
                                                        <label class="custom-control-label" for="customCheck2">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>07/30/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheck3"></input>
                                                        <label class="custom-control-label" for="customCheck3">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>08/06/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheck4"></input>
                                                        <label class="custom-control-label" for="customCheck4">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>08/13/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheck5"></input>
                                                        <label class="custom-control-label" for="customCheck5">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>08/20/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheck6"></input>
                                                        <label class="custom-control-label" for="customCheck6">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>08/27/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheck7"></input>
                                                        <label class="custom-control-label" for="customCheck7">{""}</label>
                                                    </div>
                                                    </td>
                                                    <td>09/03/2019</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="customCheck8"></input>
                                                        <label class="custom-control-label" for="customCheck8">{""}</label>
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