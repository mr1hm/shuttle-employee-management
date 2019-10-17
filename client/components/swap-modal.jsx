import React from 'react';
import './swap-modal.css';
import RouteBusDisplay from './route-bus-display';

function SwapModal(props) {
  return (
    <div className="modal fade" id="swapModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">Confirm Shift Swap</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="row justify-content-center">
              <div className="col-1 mr-2">
                <RouteBusDisplay route={props.route} bus={props.bus} />
              </div>
              <div className="col-8">
                {props.time}
                <div>
                  {props.date}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button type="button" className="btn btn-primary">Yes</button>
            <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SwapModal;
