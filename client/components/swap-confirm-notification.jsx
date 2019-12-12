import React from 'react';
import FinalSwapConfirmModal from './final-swap-confirm-modal';

class SwapConfirmNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ownShift: [],
      shiftsToSwap: [],
      name: '',
      toggle: 0
    };
    this.swapShift = this.swapShift.bind(this);
    this.declineShift = this.declineShift.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }
  componentDidMount() {
    fetch(`/api/get-final-swap-confirmation.php?id=${this.props.userId}`)
      .then(response => response.json())
      .then(data => {
        const shiftsToSwap = data;
        const ownShift = shiftsToSwap.filter(oneShift => oneShift.user_id === this.props.userId);
        const otherPersonShifts = shiftsToSwap.filter(oneShift => oneShift.user_id !== this.props.userId);
        const targetId = otherPersonShifts[0].user_id;
        fetch(`/api/swap-operator-name.php?id=${targetId}`)
          .then(response => response.json())
          .then(name => {
            const fullName = name[0].first_name + ' ' + name[0].last_name;
            this.setState({
              name: fullName
            });
          })
          .catch(error => console.error('Fetch failed', error));
        this.setState({
          ownShift: ownShift,
          shiftsToSwap: otherPersonShifts
        }
        );
      })
      .catch(error => console.error('Fetch failed', error));
  }
  swapShift() {
    const ownShift = this.state.ownShift;
    const shiftsToSwap = this.state.shiftsToSwap;
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

  declineShift() {
    const ownShift = this.state.ownShift;
    const shiftsToSwap = this.state.shiftsToSwap;
    const body = {
      target_id: shiftsToSwap[0].user_id,
      user_id: shiftsToSwap[0].target_user_id,
      original_rounds: ownShift,
      target_rounds: shiftsToSwap
    };
    fetch('/api/decline-swap-shift.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .catch(err => console.error(err.message));
  }

  toggleModal() {
    this.setState({
      toggle: 1
    });
  }
  render() {
    const ownShift = this.state.ownShift;
    const shiftsToSwap = this.state.shiftsToSwap;
    if (this.state.toggle) {
      return (
        <FinalSwapConfirmModal ownShift={ownShift} shiftsToSwap={this.state.shiftsToSwap} declineShift={this.declineShift} swapShift={this.swapShift} name={this.state.name} />
      );
    }
    if (typeof ownShift === 'undefined' || shiftsToSwap.length === 0 || ownShift.length === 0) {
      return null;
    } else {
      return (
        <>
          <div className="row justify-content-center text-center mt-5">
            <div className="col-8">
              <h3>Confirm Swap with {this.state.name}?</h3>
            </div>
            <div className="col-2">
              <button type="button" onClick={this.toggleModal} className="btn btn-primary w-75">Accept</button>
            </div>
            <div className="col-2">
              <button type="button" onClick={this.declineShift} className="btn btn-danger w-75">Decline</button>
            </div>
          </div>
          {/* <div className="row text-center">
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
          {ownShift.map(oneShift => {
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
              <Link to="/welcome/">
                <button type="button" onClick={this.swapShift} className="btn btn-lg btn-primary w-25">Accept</button>
              </Link>
            </div>
            <div className="col text-center">
              <Link to="/welcome/">
                <button type="button" onClick={this.declineShift} className="btn btn-lg btn-danger w-25">Decline</button>
              </Link>
            </div>
          </div> */}
        </>
      );
    }
  }
}

export default SwapConfirmNotification;
