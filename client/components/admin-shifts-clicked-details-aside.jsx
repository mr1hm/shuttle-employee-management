import React from 'react';
import './admin-shifts-display.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

class AdminClickedShiftDetailsAside extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.handleClickExpand = this.handleClickExpand.bind(this);
  }
  handleClickExpand() {
    this.setState({
      expanded: !this.state.expanded
    });
  }
  checkIfUnassignedShift() {
    if (this.props.shiftType === 'active') {
      return null;
    }
    return <FontAwesomeIcon icon={faAngleRight} className={`angleIcon ${this.checkIfExpanded()}`} />;
  }
  checkIfExpanded() {
    if (this.state.expanded) {
      return 'angleIconRotate';
    }
    return '';
  }
  checkIfAssignedShift() {
    if (this.props.shiftType === 'active') {
      return this.renderRoundDetails();
    }
  }
  renderRoundDetails() {
    return (
      <div className="roundDetails">
        Round details:
        {this.props.rounds.map(round =>
          <div key={round.id} className="roundDetailContainer">
            <div className="roundTime">{round.roundTime}</div>
            <button
              id={round.id}
              className="btn btn-danger"
              data-toggle="modal"
              data-target="#confirmModal"
              onClick={this.props.onClickUnassignOperator}>
              Unassign Operator
            </button>
          </div>)}
      </div>
    );
  }
  render() {
    const lastName = this.props.userName.last;
    const firstName = this.props.userName.first;
    const displayName = lastName + ', ' + firstName;
    let shiftStatus = 'Unscheduled';
    let assignedShiftClass = '';
    let adminShiftExpandedClass = '';
    if (this.props.shiftType === 'active') {
      shiftStatus = 'Scheduled';
      assignedShiftClass = 'assignedShift';
    }
    if (this.state.expanded) {
      adminShiftExpandedClass = 'adminShiftDetailsExpanded';
    }
    return (
      <div className={`adminShiftDetails d-flex flex-column border-bottom p-1 ${assignedShiftClass} ${adminShiftExpandedClass}`}>
        <div className='adminShiftAngleTimeContainer' onClick={this.handleClickExpand}>{this.checkIfUnassignedShift()} {this.props.shiftTime}</div>
        <div>Operator: {displayName}</div>
        <div>ID#: {this.props.userId}</div>
        <div>Status: {shiftStatus}</div>
        <div>Rounds: {this.props.rounds.length}</div>
        {this.checkIfAssignedShift()}
      </div>
    );
  }
}

export default AdminClickedShiftDetailsAside;
