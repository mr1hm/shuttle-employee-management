import React from 'react';

export default class AdminConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      assignStatus: 'none'
    };
    this.handleClickConfirmAssign = this.handleClickConfirmAssign.bind(this);
    this.handleClickConfirmUnassign = this.handleClickConfirmUnassign.bind(this);
    this.handleAssignStatusChange = this.handleAssignStatusChange.bind(this);
  }
  handleClickConfirmAssign() {
    if (this.state.assignStatus === 'none') {
      return;
    }
    this.props.onClickConfirmAssign(this.props.operator.id, this.state.assignStatus);
  }
  handleClickConfirmUnassign() {
    if (this.state.assignStatus === 'none') {
      return;
    }
    this.props.onClickConfirmUnassign(this.props.operator.id, this.state.assignStatus);
  }
  handleAssignStatusChange(e) {
    console.log('assigntype: ', e.target.value);
    this.setState({
      assignStatus: e.target.value
    });
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
              <div className="input-group">
                <div className="input-group-prepend">
                  <label className="input-group-text" htmlFor="assignType">Options</label>
                </div>
                <select className="custom-select" onChange={this.handleAssignStatusChange} id={this.props.operator.id}>
                  <option defaultValue value="none" >Choose...</option>
                  <option value="single">Single Shift</option>
                  <option value="all">Rest of Session</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" data-dismiss={this.state.assignStatus === 'none' ? '' : 'modal'} onClick={this.returnClickHandler()}>Confirm</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
