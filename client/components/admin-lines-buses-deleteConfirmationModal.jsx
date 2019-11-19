import React from 'react';
import Lines from './admin-lines-buses-lines';

export default class DeleteConfirmationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: null
    };
  }

  render() {
    const {line } = this.props;
    return (
      <div className="container deleteConfirmationModal">
        <div className="row">
          <div className="col d-flex justify-content-center">
            <h3 className="deleteConfirmationModalHeader">Are you sure you want to delete Line {this.props.line.line_name}?</h3>
          </div>
        </div>
        <div className="row">
          <div className="col d-flex justify-content-center">
            <button className="btn btn-success w-100 deleteConfirmationModalConfirmBtn" onClick={() => this.props.deleteLine(line.real_route_id, line.sessionID)}>Confirm</button>
          </div>
          <div className="col d-flex justify-content-center">
            <button className="btn btn-warning w-100 deleteConfirmationModalCancelBtn" onClick={this.props.handleDeleteLine}>Cancel</button>
          </div>
        </div>

      </div>
    );
  }
}
