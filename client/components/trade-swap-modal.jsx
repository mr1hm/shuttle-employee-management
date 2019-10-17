import React from 'react';
import RouteBusDisplay from './route-bus-display';


class TradeSwap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view:""
    }
  }

  render() {
    const timeSpan = this.props.timeSpan;
    const dateAndRound = this.props.dateAndRound;
      return (

        <div className="container d-flex flex-column justify-content-around h-100">
          <div className="row">
            <h1> Trade/Swap </h1>
          </div>
          <div className="row justify-content-center">
            <div className="btn-group w-50">
              <button className="btn btn-secondary btn-lg dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Select Coworker
            </button>
              <div className="dropdown-menu w-100">
                ...
            </div>
            </div>
          </div>
          <div className="row justify-content-center h-25">
            <div className="col-1">
              <RouteBusDisplay route={this.props.route} bus={this.props.busNumber} />
            </div>
            <div className="col-4">
              {timeSpan}
              <div>
                {dateAndRound}
              </div>
            </div>
          </div>
          <div className="row h-25 justify-content-center">
            <div className="col h-50 d-flex justify-content-center ">
              <button type="button" onClick={()=>this.props.close()} className="btn btn-lg btn-light w-75">Cancel</button>
            </div>
            <div className="col h-50 d-flex justify-content-center">
              <button type="button" data-toggle="modal" data-target="#tradeModal" className="btn btn-lg btn-success w-75">Trade</button>
              <div className="modal fade" id="tradeModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLongTitle">Confirm Shift Trade</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      ...
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col h-50 d-flex justify-content-center">
              <button type="button" className="btn btn-lg btn-primary w-75">Swap</button>
            </div>
          </div>
        </div>
      );

  }
}

export default TradeSwap;
