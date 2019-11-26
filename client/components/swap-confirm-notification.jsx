import React from 'react';
import RouteBusDisplay from './route-bus-display';
import { convertMilitaryTime, calcShiftLenghtInHourMinFormat, createDateStringFromDateObject } from '../lib/time-functions';

class SwapConfirmNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ownShift: [],
      shiftsToSwap: []
    };
    this.swapShift = this.swapShift.bind(this);
  }
  componentDidMount() {
    fetch(`/api/get-final-swap-confirmation.php?id=${this.props.userId}`)
      .then(response => response.json())
      .then(data => {
        const shiftsToSwap = data;
        const lastShift = shiftsToSwap.pop();
        this.setState({
          ownShift: lastShift,
          shiftsToSwap: shiftsToSwap
        }
        );
      })
      .catch(error => console.error('Fetch failed', error));
  }
  swapShift() {
    const ownShift = this.state.ownShift;
    const shiftsToSwap = this.state.shiftsToSwap;
    console.log('OwnShift', ownShift);
    console.log('shiftsToSwap', shiftsToSwap);
    // const { selectedRoundsToSwap } = this.state;
    const body = {
      target_id: shiftsToSwap[0].user_id,
      user_id: shiftsToSwap[0].target_user_id,
      original_rounds: ownShift,
      target_rounds: shiftsToSwap
    };
    fetch('/api/swap-shift.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .catch(err => console.error(err.message));

  }
  render() {
    const ownShift = this.state.ownShift;
    const shiftsToSwap = this.state.shiftsToSwap;
    if (typeof ownShift === 'undefined' || shiftsToSwap.length === 0) {
      return null;
    } else {
      return (
        <>
          <div className="row justify-content-center text-center mt-5">
            <div className="col">
              <h3>Confirm Swap</h3>
            </div>
          </div>
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

          <div className="row text-center justify-content-center">
            <div className="col-2">
              {createDateStringFromDateObject(parseInt(ownShift.shift_date) * 1000)}
            </div>
            <div className="col-4 d-flex justify-content-center">
              <RouteBusDisplay route={ownShift.line_name} bus={ownShift.bus_info_id} />
            </div>
            <div className="col-3">{ownShift.length === 0 ? ownShift.start_time + '-' + ownShift.end_time : convertMilitaryTime(ownShift.start_time) + '-' + convertMilitaryTime(ownShift.end_time)}</div>
            <div className="col-3">{calcShiftLenghtInHourMinFormat(ownShift.start_time, ownShift.end_time)}</div>
          </div>

          <div className="row justify-content-center text-center">
            <div className="col-2 ml-3 mt-3 mb-3">
              <h3>WITH</h3>
            </div>
          </div>

          {this.state.shiftsToSwap.map(oneShift => {
            return (
              <div key={oneShift.id} className="row text-center justify-content-center">
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
          })
          }
          <div className="row mt-5">
            <div className="col text-center">
              <button type="button" onClick={this.swapShift} className="btn btn-lg btn-primary w-25">Accept</button>
            </div>
            <div className="col text-center">
              <button type="button" className="btn btn-lg btn-danger w-25">Decline</button>
            </div>
          </div>
        </>
      );
    }
  }
}

export default SwapConfirmNotification;
