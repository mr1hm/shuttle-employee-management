import React from 'react';
import { Link } from 'react-router-dom';
import { convertMilitaryTime, createDateObject } from '../../../lib/time-functions';
import TopMenuHamburger from '../../topmenu/topmenu-general';
import RouteBusDisplay from '../../route-bus-display';
import PostModal from './post-modal';
import Round from './round';

import './shifts-details.css';

class ShiftsDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postModalOpen: false,
      shiftOverview: null,
      shiftDetails: null,
      checkedRounds: [],
      swapFlag: 0
    };
    this.passCheckedRoundIds = this.passCheckedRoundIds.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.selectShift = this.selectShift.bind(this);
    this.selectAllRounds = this.selectAllRounds.bind(this);
    this.unselectAllRounds = this.unselectAllRounds.bind(this);
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
    const swapFlag = this.props.location.state ? this.props.location.state.swapFlag : 0;
    this.getShifts();
    this.setState({
      swapFlag: swapFlag
    });
  }
  selectShift(id) {
    const { checkedRounds } = this.state;
    if (checkedRounds.includes(id)) {
      checkedRounds.splice(checkedRounds.indexOf(id), 1);
    } else {
      checkedRounds.push(id);
    }
    this.setState({ checkedRounds: checkedRounds });
  }
  selectAllRounds() {
    this.setState({ selectAll: true });
  }
  unselectAllRounds() {
    this.setState({ selectAll: false });
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
            <div className="col">
              <TopMenuHamburger/>
            </div>
          </div>
        </div>);
    }
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
            <div className="col">
              <TopMenuHamburger userId={userId}/>
            </div>
          </div>
          <div className="row align-items-center mb-2">
            <div className="col-2 col-md-1">
              <RouteBusDisplay route={this.state.shiftOverview.line_name} bus={this.state.shiftOverview.bus_info_id}/>
            </div>
            <div className="col text-left col-md-4">
              {timeDisplay}
            </div>
          </div>
          <div className="row my-4 flex-wrap justify-content-space-between">
            <div className="col text-left"><h5>Tap or click the shifts you want to change</h5></div>
          </div>
          <div className="row mb-3">
            <div className="col">
              {this.state.selectAll
                ? <button className="btn btn-success" onClick={this.unselectAllRounds}>
                  Unselect All
                </button>
                : <button className="btn btn-success" onClick={this.selectAllRounds}>
                  Select All
                </button>
              }

            </div>
            {this.state.swapFlag ? (
              <div className="col d-flex justify-content-end">
                <button className="btn btn-primary mr-3">
                  <Link to={{
                    pathname: '/trade-notification',
                    state: {
                      swapFlag: this.state.swapFlag
                    }
                  }}
                  onClick={this.passCheckedRoundIds}>
                    Select Swap Shift
                  </Link>
                </button>
              </div>
            ) : (
              <div className="col d-flex justify-content-end">
                <button className="btn btn-primary mr-3" onClick={this.toggleModal}>
                    Post
                </button>
                <button className="btn btn-primary mr-3">
                  <Link to='/trade-swap'
                    onClick={this.passCheckedRoundIds}>
                      Trade/Swap
                  </Link>
                </button>
              </div>
            )}
          </div>
          <div className="row">
            <div className="col">
              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th scope="col">Start</th>
                    <th scope="col">End</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.shiftDetails.map((shift, index) => {
                    return (
                      <Round
                        id={shift.roundID}
                        selectShift={this.selectShift}
                        key={shift.roundID}
                        startTime={shift.start_time}
                        endTime={shift.end_time}
                        selected={this.state.selectAll}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ShiftsDetails;
