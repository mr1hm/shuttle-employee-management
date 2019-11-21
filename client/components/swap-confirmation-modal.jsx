import React from 'react';
import RouteBusDisplay from './route-bus-display';
import { Link } from 'react-router-dom';
import { convertMilitaryTime, calcShiftLenghtInHourMinFormat, createDateStringFromDateObject } from '../lib/time-functions';

class SwapConfirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRoundsToSwap: []
    };
    this.swapShift = this.swapShift.bind(this);
  }
  componentDidMount() {
    const selectedShift = this.props.allShifts.filter(oneShift => this.props.selectedRoundId === oneShift.round_id);
    this.setState({
      selectedRoundsToSwap: selectedShift
    });
  }
  swapShift() {
    const { selectedRoundsToSwap } = this.state;
    const body = {
      target_id: selectedRoundsToSwap[0].target_user_id,
      user_id: selectedRoundsToSwap[0].user_id,
      original_rounds: selectedRoundsToSwap,
      target_rounds: this.props.ownShiftsToSwap
    };

    fetch('/api/pending-swap-shifts.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .catch(err => console.error(err.message));

  }
  render() {
    return (
      <div className="modal fade show" style={{ display: 'block' }} id="swapConfirmationModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Confirm shift swap?</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row text-center">
                <div className="col-2">
                  <h5>Date</h5>
                </div>
                <div className="col-4">
                  <h5>Bus Line/Number</h5>
                </div>
                <div className="col-3">
                  <h4>Shift Time</h4>
                </div>
                <div className="col-3">
                  <h4>Shift Length</h4>
                </div>
              </div>
              {this.state.selectedRoundsToSwap.map(oneShift => {
                return (
                  <div key={oneShift.round_id} className="row text-center justify-content-center">
                    <div className="col-2">
                      {createDateStringFromDateObject(parseInt(oneShift.shift_date) * 1000)}
                    </div>
                    <div className="col-4 d-flex justify-content-center">
                      <RouteBusDisplay route={oneShift.line_name} bus={oneShift.bus_info_id} />
                    </div>
                    <div className="col-3">{convertMilitaryTime(oneShift.start_time) + '-' + convertMilitaryTime(oneShift.end_time)}</div>
                    <div className="col-3">{calcShiftLenghtInHourMinFormat(oneShift.start_time, oneShift.end_time)}</div>
                  </div>
                );
              })}
              <div className="row justify-content-center">
                <div className="col-3 ml-3 mt-3 mb-3">
                  <h3>WITH</h3>
                </div>
              </div>
              {this.props.ownShiftsToSwap.map(oneShift => {
                return (
                  <div key={oneShift.roundID} className="row text-center justify-content-center">
                    <div className="col-2">
                      {createDateStringFromDateObject(parseInt(oneShift.date) * 1000)}
                    </div>
                    <div className="col-4 d-flex justify-content-center">
                      <RouteBusDisplay route={oneShift.line_name} bus={oneShift.bus_info_id} />
                    </div>
                    <div className="col-3">{convertMilitaryTime(oneShift.start_time) + '-' + convertMilitaryTime(oneShift.end_time)}</div>
                    <div className="col-3">{calcShiftLenghtInHourMinFormat(oneShift.start_time, oneShift.end_time)}</div>
                  </div>
                );
              })}
            </div>
            <div className="modal-footer justify-content-center">
              <Link to='/welcome/' className="btn btn-primary" onClick={this.swapShift}>Yes</Link>
              <Link to='/welcome/'className="btn btn-secondary" data-dismiss="modal">No</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default SwapConfirmation;
