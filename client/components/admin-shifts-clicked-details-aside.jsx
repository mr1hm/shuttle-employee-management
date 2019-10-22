import React from 'react';
import './admin-shifts-display.css';

class AdminClickedShiftDetailsAside extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickUnassignOperator = this.handleClickUnassignOperator.bind(this);
  }
  handleClickUnassignOperator() {

  }
  generateConditionalElement() {
    if (this.props.shiftType === 'active') {
      return this.renderRoundDetails();
    }
  }
  renderRoundDetails() {
    return (
      this.props.rounds.map(round =>
        <div key={round.id} className="roundDetailContainer">
          <div className="roundStart">{`Start: ${round.start}`}</div>
          <div className="roundEnd">{`End: ${round.end}`}</div>
          <button id={round.id} className="btn btn-danger" onClick={this.props.onClickUnassignOperator}>Unassign Operator</button>
        </div>
      )
    );
  }
  render() {
    const lastName = this.props.userName.last;
    const firstName = this.props.userName.first;
    const displayName = lastName + ', ' + firstName;
    let shiftStatus;
    if (this.props.shiftType === 'active') {
      shiftStatus = 'Scheduled';
    } else shiftStatus = 'Unscheduled';
    return (
      <div className="adminShiftDetails d-flex flex-column border-bottom p-1">
        <div>Operator: {displayName}</div>
        <div>ID#: {this.props.userId}</div>
        <div>Time: {this.props.shiftTime}</div>
        <div>Rounds: {this.props.rounds.length}</div>
        <div>Status: {shiftStatus}</div>
        {this.generateConditionalElement()}
      </div>
    );
  }
}

export default AdminClickedShiftDetailsAside;
