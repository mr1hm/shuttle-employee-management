import React from 'react';
import TopMenuShift from '../../topmenu/topmenu-shift';

function convertUnixMonthDay(time) {
  const convertedDate = new Date(time);
  const dateString = "" + convertedDate;
  const arrayDateString = dateString.split(' ');
  return arrayDateString[1]+' '+arrayDateString[2]+' '+arrayDateString[3];
}

function convertUnixToDay(time) {
  const convertedDate = new Date(time);
  const dateString = "" + convertedDate;
  const arrayDateString = dateString.split(' ');
  return arrayDateString[0];
}

function OneOfMyShifts(props) {
  // console.log("shift date??", props.shifts.shiftDate);
    let shiftButton = (props.shifts.status === 'posted') ? "Cancel Post" : "Details";
    let numOfRounds = (props.shifts.endTime-props.shifts.startTime)/props.shifts.legDuration;

    return(
        <tr>
            <td> {props.shifts.lineName} / {props.shifts.busID} </td>
            <td> {convertUnixMonthDay(parseInt(props.shifts.shiftDate))} </td>
            <td> {props.shifts.startTime} - {props.shifts.endTime} </td>
            <td> {numOfRounds.toFixed(2)} </td>
            <td> {props.shifts.endTime - props.shifts.startTime} </td>
            <td> {props.shifts.status} </td>
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
    fetch(`/api/shifts-day.php/`, {  // ADD QUERY FOR SHIFTDATE HERE
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
      });
  }
    
  render(){
    var defaultDate=1564531200000;
    console.log("this.state.myshifsttoday", this.state.myShiftsToday)
    console.log("this.state.myshiftstoday.data:", this.state.myShiftsToday.data)
  // let noShifts = (!this.state.myShiftsToday.data) ? "No shifts scheduled today" : null;

  //JPT - for routing had to alter date information
  if (this.props.match.params.date === undefined) {
    var dateToPass = defaultDate;
  } else {
    dateToPass = this.props.match.params.date;
  }

  if (this.state.myShiftsToday.length === 0) {
      return (
      <div>
      <TopMenuShift title="DAY" page='day' date={dateToPass}/>
      <div>No data :(</div>
      </div>
      );
  } 

  return (
    <div>
    <TopMenuShift title="DAY" page='day' date={dateToPass}/>
    <div>Today's Date {convertUnixMonthDay(parseInt(defaultDate))}</div>
    {/* <div>Total Hours: {totalHours} [posted: {postedHours}] </div> */}
      <table className='table table-striped'>
        <thead>
            <tr>
                <td>Line/#</td>
                <td>Shift Date</td>
                <td>Start-End</td>
                <td>Rounds</td>
                <td>Shift Hours</td>
                <td>Post Status</td>
                <td>Action</td>
            </tr>
        </thead>
        <tbody>
        {
          this.state.myShiftsToday.data.map(shifts => {
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
      This is under the table section in render
      </div>
    );
  }
}

export default ShiftsDay;

//this.props.match.param.startDate==='2019-09-02'


// componentDidUpdate
//check whether shiftDate is === shiftDate, if no, do another fetch