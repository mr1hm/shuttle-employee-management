import React from 'react';
import {Link} from 'react-router-dom';
import { convertUnixTime, convertUnixDateDay, convertUnixDateNumber, getShiftStartHour,
  getShiftStartMinute, getShiftEndHour, getShiftEndMinute, calculateDailyWorkingHours, getTotalDayWorkingHours } from '../../../lib/time-functions';
import TopMenuShift from '../../topmenu/topmenu-shift';

function convertUnixMonthDay(time) {
  const getTheDate = new Date(time);
  const dateString = getTheDate.getFullYear()+ '-' +('0' + getTheDate.getDate()).slice(-2)
          + '-' + ('0' + (getTheDate.getMonth()+1)).slice(-2);
      return dateString;
}

function OneOfMyShifts(props) {
    let shiftButton = (props.shifts.status === 'posted') ? "Cancel Post" : "Details";
    let numOfRounds = (props.shifts.endTime-props.shifts.startTime)/(props.shifts.legDuration);
    
    return(
        <tr>
            <td> {props.shifts.lineName} / {props.shifts.busID} </td>
            {/* <td> {convertUnixMonthDay(parseInt(props.shifts.shiftDate))} </td> */}
            <td> {props.shifts.startTime} - {props.shifts.endTime} </td>
            <td> {numOfRounds.toFixed(2)} </td>
            <td> {calculateDailyWorkingHours(props.shifts.startTime, props.shifts.endTime)} </td>
            <td> {props.shifts.status} </td>
            <td> <input type="button" value={shiftButton} /> </td> 
        </tr>          
    )
}

class ShiftsDay extends React.Component {
  constructor(props){
    super(props);
    this.query = ``;
    this.fetchCallMethod = this.fetchCallMethod.bind(this);
    this.state = {
      myShiftsToday: []
    }
  }


  fetchCallMethod(query){
    fetch(`/api/shifts-day.php` + query, {
      method: 'GET'
    })
      .then(response => {
        console.log("res:", response)
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
    this.fetchCallMethod(this.query);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.date !== this.props.match.params.date) {
      this.fetchCallMethod(this.query);
    }
  
  }

  render(){
    if (this.props.match.params.date === undefined) {
    var dateToPass = parseInt(this.props.defaultDate);
  } else {
    dateToPass = this.props.match.params.date;
    var dateToQuery = new Date(dateToPass).getTime()+25200000;
    this.query = `?shiftDate=${dateToQuery}`;
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
                  key = { shifts.id }
                  shifts = { shifts }
                />                              
            );
          })
        }
        </tbody>     
      </table>
      </div>
    );
  }
}

export default ShiftsDay;