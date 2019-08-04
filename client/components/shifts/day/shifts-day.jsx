import React from 'react';
import TopMenuShifts from '../../topmenu/topmenu-shift';


function OneOfMyShifts(props) {
    let recurringShift = (props.shifts.recurring) ? "Recurring Shift" : "One-time Shift";
    let shiftPosted =  (props.shifts.posted) ? "Shift is Posted" : null;
    let shiftButton = (props.shifts.posted) ? "Cancel Post" : "Details";
    // debugger;
    return(
        <tr>
            <td> {props.shifts.line} {props.shifts.busNum} </td>
            <td> {props.shifts.startTime} - {props.shifts.endTime} </td>
            <td> <strong>{recurringShift}</strong> | Rounds: {props.shifts.numRounds} </td>
            <td> {props.shifts.hoursThisShift} </td>
            <td> {shiftPosted} </td>
            <td> <input type="button" value={shiftButton} /> </td> 
        </tr>          
    )
}

class ShiftsDay extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      myShiftsToday: []
    }
  }
  componentDidMount(){
    fetch(`/api/dummy-data-day-shifts.json`, {
      method: 'GET'
    })
      .then(response => {
        console.log("res:", response)
        return response.json()
      })
      .then(myJson => {
        this.setState({
          myShiftsToday: myJson.myShiftToday
        })
      });
  }
    
  render(){
  let noShifts = (!this.state.myShiftsToday.length) ? "No shifts scheduled today" : null;
  let postedHours = 0;
  let totalHours = 0;
  
  for (var i = 0 ; i < this.state.myShiftsToday.length; i++) {
    if(this.state.myShiftsToday[i].posted) {
      postedHours += this.state.myShiftsToday[i].hoursThisShift;
    }
    totalHours += this.state.myShiftsToday[i].hoursThisShift;
  }
  return (

    <div>
      <TopMenuShifts title="DAY"/>
    <div>Today's Date {this.props.date}</div>
    <div>Total Hours: {totalHours} [posted: {postedHours}] </div>
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
                  key = { shifts.shiftId }
                  shifts = { shifts }
                />                              
            );
          })
        }
        </tbody>     
      </table>
      {noShifts}
      </div>
    );
  }
}

export default ShiftsDay;
