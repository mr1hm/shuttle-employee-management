import React from 'react';
import Lines from './admin-lines-buses-lines';

export default class DeleteConfirmationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteStatus: this.props.deleteStatus
    };
  }

  render() {
    const { line } = this.props;
    const { busInfo } = this.props;
    return (
      <div className="container deleteConfirmationModal">
        <div className="row">
          <div className="col d-flex justify-content-center">
            {this.state.deleteStatus === 'bus' ? <h3 className="deleteConfirmationModalHeader">Are you sure you want to delete Bus {this.props.busInfo.busNumber}?</h3> :
              <h3 className="deleteConfirmationModalHeader">Are you sure you want to delete Line {this.props.line.line_name}?</h3>}
          </div>
        </div>
        <div className="row">
          <div className="col d-flex justify-content-center">
            {this.state.deleteStatus === 'bus' ? <button className="btn btn-success w-100 deleteConfirmationModalConfirmBtn" onClick={() => this.props.deleteBus(busInfo.busID)}>CONFIRM</button> :
              <button className="btn btn-success w-100 deleteConfirmationModalConfirmBtn" onClick={() => this.props.deleteLine(line.real_route_id, line.sessionID)}>CONFIRM</button>}
          </div>
          <div className="col d-flex justify-content-center">
            {this.state.deleteStatus === 'bus' ? <button className="btn btn-warning w-100 deleteConfirmationModalCancelBtn" onClick={this.props.handleDeleteBusClicked}>CANCEL</button> :
              <button className="btn btn-warning w-100 deleteConfirmationModalCancelBtn" onClick={this.props.handleDeleteLine}>CANCEL</button>}
          </div>
        </div>
      </div>
    );
  }
}
