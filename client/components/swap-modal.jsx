import React from 'react';
import './swap-modal.css';
import RouteBusDisplay from './route-bus-display';
import { convertMilitaryTime, calcShiftLenghtInHourMinFormat } from '../lib/time-functions';

function SwapModal(props) {
  return (
    <div className="modal fade" id="swapModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">Confirm Shift Swap with {props.selectedDriver.first_name} {props.selectedDriver.last_name}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {props.allShifts.map(oneShift => {
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
            <button type="button" className="btn btn-primary">Yes</button>
            <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SwapModal;
