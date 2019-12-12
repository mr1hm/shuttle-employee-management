import React from 'react';
import RouteBusDisplay from './route-bus-display';
import { Link } from 'react-router-dom';
import { convertMilitaryTime, calcShiftLenghtInHourMinFormat, createDateStringFromDateObject } from '../lib/time-functions';

class FinalSwapConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const ownShift = this.props.ownShift;
    return (
      <div className="modal fade show" style={{ display: 'block' }} id="swapConfirmationModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Confirm shift swap with {this.props.name}?</h5>
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
              {
                ownShift.map(oneShift => {
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
              {
                this.props.shiftsToSwap.map(oneShift => {
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
              <div className="modal-footer justify-content-center text-center">
                <Link to='/welcome/' className="btn btn-primary" onClick={this.props.swapShift}>Accept</Link>
                <Link to='/welcome/' className="btn btn-danger" onClick={this.props.declineShift}>Decline</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }

}

export default FinalSwapConfirmModal;
