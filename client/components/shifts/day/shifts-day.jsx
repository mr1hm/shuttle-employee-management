import React from 'react';
import { Link } from 'react-router-dom';
import { calculateDailyWorkingHours } from '../../../lib/time-functions';
import TopMenuShift from '../../topmenu/topmenu-shift';
import Modal from '../../post-modal';
import RouteBusDisplay from '../../route-bus-display';
import ShiftsDetails from '../details/shifts-details';
import ShiftsAvailable from '../available/shifts-available';

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
    const defaultDate = parseInt(this.props.defaultDate)
    this.state = {
      myShiftsToday: [],
      isModalOpen: false,
      queryString: `?date=${defaultDate}&type=${this.props.view || 'myShifts'}`,
      dateToPass: defaultDate,
    }
  }
  fetchCallMethod(query) {
    debugger;
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

      this.fetchCallMethod(this.state.queryString);
    } else {

      this.fetchCallMethod(this.state.queryString);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    console.log( "prevProps: ", prevProps);
    console.log("prevState: " , prevState);
    if (prevProps.match.params.date !== this.props.match.params.date) {
      var dateToQuery = new Date(this.state.dateToPass).getTime() + 25200000;
      this.setState({
        dateToQuery: dateToQuery,
        queryString: `?date=${dateToQuery}&type=${this.props.view || 'myShifts'}`,
        dateToPass: this.props.match.params.date
      })
      this.fetchCallMethod(this.state.queryString);
      // this.fetchCallMethod('?date=' + this.props.defaultDate);
    }

    // let updateState = {};
    // let dateToQuery;
    // console.log("Date to Query: ", dateToQuery);

    // if (this.state.dateToQuery != prevState.dateToQuery && this.props.match.params.date) {
    //   dateToPass = this.props.match.params.date;
    //   dateToQuery = new Date(dateToPass).getTime() + 25200000;
    //   updateState.dateToQuery = dateToQuery;
    //   this.setState({
    //     dateToQuery: dateToQuery,
    //     queryString: `?date=${dateToQuery}&type=${this.props.view || 'myShifts'}`
    //   });
    // }
       if (prevProps.match.params.date !== this.props.match.params.date) {
         console.log(this.state.queryString);
         this.fetchCallMethod(this.state.queryString);
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

    if (this.state.myShiftsToday.length === 0) {
      return (
        <div>
          <TopMenuShift title="DAY" page='day' date={this.state.dateToPass} />
          <div>You have no shifts scheduled today.</div>
        </div>
      );
    }

    let shiftMin = Math.min.apply(null, this.state.myShiftsToday.map(index => index.start_time));
    let shiftMax = Math.max.apply(null, this.state.myShiftsToday.map(index => index.end_time));
    console.log("date to pass in link: ", this.state.dateToPass);

    return (

      <div>
        <div><Link to={`/shifts/day/shifts-day/${convertUnixMonthDay(this.state.dateToPass)}`}> </Link></div>
        <TopMenuShift title={this.props.view === 'myShifts' ? "DAY" : "AVAILABLE"} page='day' date={(this.state.dateToPass)} />
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

        <Modal open={this.state.isModalOpen} className="modalShiftDetails">
          <ShiftsDetails goBack={this.closeModal}> </ShiftsDetails>
        </Modal>

      </div>
    );
  }

}

export default ShiftsDay;
