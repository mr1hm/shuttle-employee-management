import React from 'react';
import './trade-modal.css';
import RouteBusDisplay from './route-bus-display';
import { Link } from 'react-router-dom';
import { convertMilitaryTime, calcShiftLenghtInHourMinFormat } from '../lib/time-functions';

class TradeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.giveShifttoSelectedDriver = this.giveShifttoSelectedDriver.bind(this);
  }
  giveShifttoSelectedDriver() {
    let arrayOfRoundIds = [];
    for (let integerI = 0; integerI < this.props.allShifts.length; integerI++) {
      arrayOfRoundIds.push(this.props.allShifts[integerI].roundID);
    }
    const selectedDriverToTradeWith = {
      user_id: this.props.allShifts[0].user_id,
      target_id: this.props.selectedDriver.user_id,
      user_round: arrayOfRoundIds
    };
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch('/api/make-shift-trade.php', {
      method: 'POST',
      body: JSON.stringify(selectedDriverToTradeWith),
      headers: headers
    })
      .then(response => response.json())
      .then(data => {
      })
      .catch(error => console.error('Fetch failed', error));

  }
  render() {
    return (
      <div className="modal fade" id="tradeModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Confirm Shift Trade with {this.props.selectedDriver.first_name} {this.props.selectedDriver.last_name}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {this.props.allShifts.map(oneShift => {
                return (
                  <div key={oneShift.roundID} className="row justify-content-center text-center">
                    <div className="col">
                      <RouteBusDisplay route={oneShift.line_name} bus={oneShift.bus_info_id} />
                    </div>
                    <div className="col-6">{convertMilitaryTime(oneShift.start_time) + '-' + convertMilitaryTime(oneShift.end_time)}</div>
                    <div className="col">{calcShiftLenghtInHourMinFormat(oneShift.start_time, oneShift.end_time)}</div>
                  </div>
                );
              })}
            </div>
            <div className="modal-footer justify-content-center">
              <Link to="/shifts/details/" onClick={this.giveShifttoSelectedDriver} className="btn btn-primary">Yes</Link>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TradeModal;
