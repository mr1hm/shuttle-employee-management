import React from 'react';
import { Link } from 'react-router-dom';
import { convertMilitaryTime, createDateObject } from '../../../lib/time-functions';
import RouteBusDisplay from '../../route-bus-display';
import PostModal from './post-modal';

class ShiftsDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postModalOpen: false,
      shiftOverview: null,
      shiftDetails: null,
      checkedRounds: [],
      swapFlag: false
    };
    this.passCheckedRoundIds = this.passCheckedRoundIds.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }
  getShifts(query) {
    const { date, userId } = this.props;
    const response = fetch(`/api/shifts-day.php?date=${date}&userID=${userId}`);
    response
      .then(response => response.json())
      .then(json => {
        const shiftOverview = json.filter(shift => shift.roundID === this.props.shiftId);
        this.setState({ shiftOverview: shiftOverview[0] });
      })
      .then(() => { this.getShiftDetails(); })
      .catch(error => { console.error(error); });
  }
  getShiftDetails() {
    const { start_time, end_time, user_id } = this.state.shiftOverview;
    const { date } = this.props;
    const response = fetch(`/api/shifts-details.php?unixdate=${date}&start_time=${start_time}&end_time=${end_time}&user_id=${user_id}`);
    response
      .then(res => res.json())
      .then(json => this.setState({ shiftDetails: json }))
      .catch(error => console.error(error));
  }

  componentDidMount() {
    const swapFlag = this.props.location.state ? this.props.location.state.swapFlag : false;
    this.getShifts();
    this.setState({
      swapFlag: swapFlag
    });
  }
  handleChange(e) {
    const { checkedRounds } = this.state;
    const { id } = e.currentTarget;
    if (checkedRounds.includes(id)) {
      checkedRounds.splice(checkedRounds.indexOf(id), 1);
    } else {
      checkedRounds.push(id);
    }
    this.setState({ checkedRounds: checkedRounds });

  }
  passCheckedRoundIds() { // callback method for post/trade/swap
    const shiftDetails = this.state.shiftDetails.filter(shift => this.state.checkedRounds.includes(shift.roundID));
    this.props.startSwapTradeTransaction(shiftDetails);
  }
  toggleModal(e) {
    this.setState({ postModalOpen: !this.state.postModalOpen });
  }
  render() {
    if (!this.state.shiftDetails) {
      return (
        <div className="container mt-2">
          <div className="row">
            <div className="col">
              <h1>No Shift Details Available</h1>
            </div>
          </div>
        </div>);
    }
    const rounds = this.state.shiftDetails.map((shift, index) => {
      return (
        <tr key={shift.roundID}>
          <td>
            <div className="form-check">
              <input id={shift.roundID} className="form-check-input" type="checkbox" onChange={this.handleChange} />
            </div>
          </td>
          <td>{convertMilitaryTime(shift.start_time)}</td>
          <td>{convertMilitaryTime(shift.end_time)}</td>
        </tr>
      );
    });
    const { start_time, end_time, date } = this.state.shiftOverview;
    const dateObj = createDateObject(date);
    const timeDisplay = (
      <>
      <div>
        {`${convertMilitaryTime(start_time)} - ${convertMilitaryTime(end_time)}`}
      </div>
      <div>
        {`${dateObj.weekday}, ${dateObj.month} ${dateObj.day}, ${dateObj.year}`}
      </div>
      </>
    );
    const { checkedRounds } = this.state;
    const { userId, date: unixDate } = this.props;
    return (
      <>
        {this.state.postModalOpen && <PostModal date={unixDate} userId={userId} checkedRounds={checkedRounds} toggleModal={this.toggleModal}/>}
        <div className="container">
          <div className="row">
            <div className="col">
              <h1>Shift Details</h1>
            </div>
          </div>
          <div className="row align-items-center mb-2">
            <div className="col-1">
              <RouteBusDisplay route={this.state.shiftOverview.line_name} bus={this.state.shiftOverview.bus_info_id}/>
            </div>
            <div className="col-4">
              {timeDisplay}
            </div>
          </div>
          <div className="row">
            <div className="col text-left"><h5>Select the shifts you want to change</h5></div>
          </div>
          <div className="row">
            <div className="col">
              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Start</th>
                    <th scope="col">End</th>
                  </tr>
                </thead>
                <tbody>
                  {rounds}
                </tbody>
              </table>
            </div>
            <div className="col-2 d-flex flex-column justify-content-space-between">
              <button className="btn btn-primary mb-2" onClick={this.toggleModal}>
                Post
              </button>
              <Link to='/trade-swap'
                className="btn btn-primary mb-2"
                onClick={this.passCheckedRoundIds}>
                Trade/Swap
              </Link>
              {/* <button className="btn btn-primary" onClick={this.props.history.goBack()}>My Shifts</button> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ShiftsDetails;
