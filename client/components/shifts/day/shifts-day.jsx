import React from 'react';
import { Link } from 'react-router-dom';
import { calculateDailyWorkingHours } from '../../../lib/time-functions';
import TopMenuShift from '../../topmenu/topmenu-shift';
import Modal from '../../post-modal';
import RouteBusDisplay from '../../route-bus-display';
import ShiftsDetails from '../details/shifts-details';

function convertUnixMonthDay(time) {
  const getTheDate = new Date(time);
  const dateString = getTheDate.getFullYear() + '-' + ('0' + getTheDate.getDate()).slice(-2)
    + '-' + ('0' + (getTheDate.getMonth() + 1)).slice(-2);
  return dateString;
}

function OneOfMyShifts(props) {
  let shiftButton = (props.shifts.status === 'posted') ? "Cancel Post" : "Details";
  let statusColor = (props.shifts.status === 'posted') ? "border border-warning" : "border border-primary";
  // let numOfRounds = (props.shifts.end_time-props.shifts.start_time)/(props.shifts.legDuration);
  return (
    <tr>
      {/* <td> {props.shifts.line_name} / {props.shifts.bus_info_id} </td> */}
      <td> <RouteBusDisplay bus={props.shifts.bus_info_id} route={props.shifts.line_name} /> </td>
      {/* <td> {props.shifts.start_time} - {props.shifts.end_time} </td> */}
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
  constructor(props) {
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
  fetchCallMethod(query) {
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
      .catch(error => { throw (error) });
  }
  componentDidMount() {
    if (!this.query.length) {
      this.fetchCallMethod('?date=' + this.props.defaultDate);
    } else {
      this.fetchCallMethod(this.query);
    }
  }

  componentDidUpdate(prevProps) {
    // debugger;
    if (prevProps.match.params.date !== this.props.match.params.date) {
      this.fetchCallMethod(this.query);
    }
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
    if (this.props.match.params.date === undefined) {
      var dateToPass = parseInt(this.props.defaultDate);
    } else {
      dateToPass = this.props.match.params.date;
      var dateToQuery = new Date(dateToPass).getTime() + 25200000;
      console.log("dateToQuery:", dateToQuery);
      this.query = `?date=${dateToQuery}`;
    }
    if (this.state.myShiftsToday.length === 0) {
      return (
        <div>
          <TopMenuShift title="DAY" page='day' date={dateToPass} />
          <div>You have no shifts scheduled today.</div>
        </div>
      );
    }
    let shiftMin = Math.min.apply(null, this.state.myShiftsToday.map(index => index.start_time));
    let shiftMax = Math.max.apply(null, this.state.myShiftsToday.map(index => index.end_time));
    console.log('shiftMin:', shiftMin); // returns 600
    console.log('shiftMax', shiftMax); // returns 1100
    return (
      <div>
        <div><Link to={`/shifts/day/shifts-day/${convertUnixMonthDay(dateToPass)}`}> </Link></div>
        <TopMenuShift title="DAY" page='day' date={(dateToPass)} />
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
              this.state.myShiftsToday.map(shifts => {
                return (
                  < OneOfMyShifts
                    key={shifts.start_time}
                    shifts={shifts}
                    clickHandler={this.openModal}
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
        <Modal open={this.state.isModalOpen} className="modalShiftDetails">
          <ShiftsDetails 
            goBack={this.closeModal} 
            unixDate={this.props.match.params.date} 
            blockStartTime={}   // the start time (military 4-digit) of the first round in the block clicked
            bockEndTime={}      // the end time (military 4-digit) of the last round of the block clicked
            userID={}           // the user's ID number
            busLine={}          // the letter representing the line (route) of the selected round or block
            busNumber={}        // the number of the bus for the selected round or block
            >       
          </ShiftsDetails>
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
