import React from 'react';

export default class AdminConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.handleClickConfirmAssign = this.handleClickConfirmAssign.bind(this);
    this.handleClickConfirmUnassign = this.handleClickConfirmUnassign.bind(this);
  }
  handleClickConfirmAssign() {
    this.props.onClickConfirmAssign(this.props.operator.id);
  }
  handleClickConfirmUnassign() {
    this.props.onClickConfirmUnassign();
  }
  checkIfAssignOrUnassign() {
    if (this.props.assign) {
      return `assign ${this.props.operator.name} to`;
    }
    return `unassign ${this.props.operator.name} from`;
  }
  returnClickHandler() {
    if (this.props.assign) {
      return this.handleClickConfirmAssign;
    }
    return this.handleClickConfirmUnassign;
  }
  renderShiftsSelected() {
    var elements = [];
    var shifts = [];
    if (this.props.assign) {
      shifts = this.props.shifts;
      for (let shiftIndex = 0; shiftIndex < shifts.length; shiftIndex++) {
        elements.push(
          <div
            key={shifts[shiftIndex].roundId} className="shiftTime">
            {`${shifts[shiftIndex].lineBus}: ${shifts[shiftIndex].shiftTime}`}
          </div>
        );
      }
    } else if (this.props.unassign) {
      shifts = this.props.shiftsToUnassign;
      for (let shiftIndex = 0; shiftIndex < shifts.length; shiftIndex++) {
        elements.push(
          <div
            key={shiftIndex} className="shiftTime">
            {`${shifts[shiftIndex]}`}
          </div>
        );
      }
    }

    return elements;
  }
  render() {
    return (
      <div className="modal fade" id="confirmModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Please Confirm</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {`Are you sure you want to ${this.checkIfAssignOrUnassign()} these shifts?`}
              {this.renderShiftsSelected()}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.returnClickHandler()}>Confirm</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
