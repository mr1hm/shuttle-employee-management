import React from 'react';
import RouteBusDisplay from './route-bus-display';
import TopMenuGeneral from './topmenu/topmenu-general';
import { Link } from 'react-router-dom';
import NotificationShift from './trade-notification-shift';
import SwapConfirmation from './swap-confirmation-modal';
import SwapConfirmNotification from './swap-confirm-notification';
import MultipleSelectedShiftsSwap from './multiple-selected-shifts-notification';

class TradeNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newShifts: [],
      selectedDriver: {},
      swapShifts: [],
      selectedRoundId: 0,
      notificationCount: 0
    };
    this.removeShift = this.removeShift.bind(this);
    this.giveShiftToSelectedDriver = this.giveShiftToSelectedDriver.bind(this);
  }
  componentDidMount() {
    const selectedRoundId = this.props.location.state.swapFlag ? this.props.location.state.swapFlag : 0;
    const swapShift = this.props.shiftDetails;
    fetch(`/api/get-notifications.php`)
      .then(response => response.json())
      .then(shiftsArrayOfObjects => {
        this.setState({
          newShifts: shiftsArrayOfObjects,
          swapShifts: swapShift,
          selectedRoundId: selectedRoundId,
          notificationCount: shiftsArrayOfObjects.length
        });
      })
      .catch(error => console.error('Fetch failed', error));
  }
  giveShiftToSelectedDriver(roundID, targetID) {
    const selectedDriverToTradeWith = {
      user_id: this.props.userId,
      target_id: targetID,
      user_round: roundID
    };
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch('/api/make-shift-trade.php', {
      method: 'POST',
      body: JSON.stringify(selectedDriverToTradeWith),
      headers: headers
    })
      .then(response => {
        this.setState({
          newShifts: newShifts,
          notificationCount: this.state.notificationCount - 1
        });
      })
      .catch(error => console.error('Fetch failed', error));
    const newShifts = this.state.newShifts.filter(oneShift => roundID !== oneShift.round_id);
  }
  removeShift(roundID) {
    fetch('/api/decline-shift-trade.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: roundID
      })
    })
      .then(response => {
        this.setState({
          newShifts: newShifts,
          notificationCount: this.state.notificationCount - 1
        });
      })
      .catch(err => console.error(err));
    const newShifts = this.state.newShifts.filter(oneShift => roundID !== oneShift.round_id);
  }
  render() {
    if (this.state.selectedRoundId) {
      return (
        <SwapConfirmation selectedRoundId={this.state.selectedRoundId} allShifts={this.state.newShifts} ownShiftsToSwap={this.state.swapShifts} />
      );
    }
    if (this.state.newShifts.length === 0) {
      return (
        <>
        <TopMenuGeneral notificationCount={this.state.notificationCount} userId={this.props.userId} title="Notifications" newShiftsandSelectedDriver={this.state.newShiftsandSelectedDriver} />
        <SwapConfirmNotification userId={this.props.userId} />
        </>
        // <div className="container mt-2">
        //   <div className="row justify-content-center">
        //     <div className="col-4">
        //       <h1>No Notifications</h1>
        //     </div>
        //   </div>
        // </div>);
      );
    } else {
      return (
        <div className="container">
          <div className="row justify-content-center mb-3">
            <TopMenuGeneral notificationCount={this.state.notificationCount} userId={this.props.userId} title="Notifications" newShiftsandSelectedDriver={this.state.newShiftsandSelectedDriver} />
          </div>
          <div className="row text-center">
            <div className="col-2">
              <h5>Date</h5>
            </div>
            <div className="col-2">
              <h5>Bus Line/Number</h5>
            </div>
            <div className="col-2">
              <h4>Shift Time</h4>
            </div>
            <div className="col-2">
              <h4>Shift Length</h4>
            </div>
          </div>
          {this.state.newShifts.length === 1 ? (

            this.state.newShifts.map(oneShift => {
              return (
                <NotificationShift
                  key={oneShift.id}
                  shift_date={oneShift.shift_date}
                  line_name={oneShift.line_name}
                  bus_info_id={oneShift.bus_info_id}
                  start_time={oneShift.start_time}
                  end_time={oneShift.end_time}
                  target_user_id={oneShift.target_user_id}
                  round_id={oneShift.round_id}
                  removeShift={this.removeShift}
                  giveShifttoSelectedDriver={this.giveShiftToSelectedDriver}
                  type={oneShift.type}
                />
              );
            })
          ) : (
            <MultipleSelectedShiftsSwap shifts={this.state.newShifts} />
          )}
          <div>
            <SwapConfirmNotification userId={this.props.userId} />
          </div>
        </div>
      );

    }
  }
}

export default TradeNotification;
