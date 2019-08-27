import React from 'react';
import {Link} from 'react-router-dom';
import { calculateDailyWorkingHours } from '../../../lib/time-functions';
import TopMenuShift from '../../topmenu/topmenu-shift';
import Modal from '../../post-modal';
import RouteBusDisplay from '../../route-bus-display';
import ShiftsDetails from '../details/shifts-details';

function convertUnixMonthDay(time) {
  const getTheDate = new Date(time);
  const dateString = getTheDate.getFullYear()+ '-' +('0' + getTheDate.getDate()).slice(-2)
          + '-' + ('0' + (getTheDate.getMonth()+1)).slice(-2);
      return dateString;
}

function OneOfMyShifts(props) {
    let shiftButton = (props.shifts.status === 'posted') ? "Cancel Post" : "Details";
    let statusColor = (props.shifts.status === 'posted') ? "border border-warning" : "border border-primary";
    // let numOfRounds = (props.shifts.end_time-props.shifts.start_time)/(props.shifts.legDuration);
    return(
        <tr>
            {/* <td> {props.shifts.line_name} / {props.shifts.bus_info_id} </td> */}
            <td> <RouteBusDisplay bus={props.shifts.bus_info_id} route={props.shifts.line_name}/> </td>
            <td> {props.shifts.start_time} - {props.shifts.end_time} </td>
            <td> #rd </td>
            {/* <td> {calculateDailyWorkingHours(props.shifts.startTime, props.shifts.endTime)} </td> */}
            <td> #hrs </td>

            <td className={statusColor}> {props.shifts.status} </td>
        <td> <input type="button" value={shiftButton} onClick={props.clickHandler} /> </td>
        </tr>
    )
}

class ShiftsDay extends React.Component {
  constructor(props){
    super(props);
    this.query = ``;
    this.fetchCallMethod = this.fetchCallMethod.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      myShiftsToday: [],
      isModalOpen: false,

    }
  }
  fetchCallMethod(query){
    fetch(`/api/shifts-day.php` + query, {
      method: 'GET'
    })
      .then(response => {
        return response.json()
      })
      .then(myJson => {
        this.setState({
          myShiftsToday: myJson
        })
      })
      .catch(error => {throw(error)});
  }
  componentDidMount(){
    this.fetchCallMethod('?date='+this.props.defaultDate);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.date === undefined || prevProps.match.params.date !== this.props.match.params.date) {
      this.fetchCallMethod(this.query);
    }

  }
  openModal(){
    this.setState({
      isModalOpen: true,

    })
  }
  closeModal(){
    this.setState({
      isModalOpen: false,

    })
  }
  render(){
    if (this.props.match.params.date === undefined) {
    var dateToPass = parseInt(this.props.defaultDate);
    } else {
    dateToPass = this.props.match.params.date;
    var dateToQuery = new Date(dateToPass).getTime()+25200000; //figure this shit out right here
    console.log("dateToQuery:",dateToQuery);
    // right now it's looking for 1563951600000 (jul 24 midnihgt local (17 hours ahead of gmt), 7am gmt)
    // ^-- is app.jsx presetDataForTesting

    //db is 1560409200000 (jun 13 at mindnight local)
    //when going to jun13 it is looking for 1560384000000 (jun 12 midnight local)
    // 1560409200000 - 1560384000000  and add that to getTime()
    //now is asking for 1560409200000
    // debugger;
    
    this.query = `?date=${dateToQuery}`;
    }
    if (this.state.myShiftsToday.length === 0) {
      return (
      <div>
      <TopMenuShift title="DAY" page='day' date={dateToPass}/>
      <div>You have no shifts scheduled today.</div>
      </div>
      );
    }
    return (
      <div>
          <div><Link to={`/shifts/day/shifts-day/${convertUnixMonthDay(dateToPass)}`}> </Link></div>
      <TopMenuShift title="DAY" page='day' date={(dateToPass)}/>
        <table className='table table-striped'>
          <thead>
              <tr>
                  <td>Line/#</td>
                  {/* <td>Shift Date</td> */}
                  <td>Start-End</td>
                  <td>Rounds</td>
                  <td>Shift Hours</td>
                  <td>Post Status</td>
                  <td>Action</td>
              </tr>
          </thead>
          <tbody>
          {
            this.state.myShiftsToday.map(shifts => {
              return (
                < OneOfMyShifts
                  key={shifts.id}
                  shifts={shifts}
                  clickHandler = {this.openModal }
                />
          );
        })
      }
          </tbody>
        </table>
        {/* <Modal open={this.state.isModalOpen}>
          <h2> PLEASE CONFIRM: <br></br>Do you really want to post this shift?</h2>
          <p><button className= "modalCancelButton" onClick= {() => this.closeModal()}>Cancel</button></p>
          <p><button onClick={() => this.closeModal()}>Yes, I want to post</button></p>
        </Modal> */}
        <Modal open={this.state.isModalOpen}  className="modalShiftDetails">
          <ShiftsDetails goBack={this.closeModal}> </ShiftsDetails>
        </Modal>

      </div>
    );
  }

}
/*
  key={shifts.id},
                shifts = { shifts },
                clickHandler = {()=> {}}
                */
export default ShiftsDay;