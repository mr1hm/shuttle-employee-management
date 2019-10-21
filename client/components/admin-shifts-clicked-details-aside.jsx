import React from 'react';
import './admin-shifts-display.css';

class AdminClickedShiftDetailsAside extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickUnassignOperator = this.handleClickUnassignOperator.bind(this);
  }
  handleClickUnassignOperator() {
    this.props.onClickUnassignOperator(this.props.roundId);
  }
  generateConditionalElement() {
    if (this.props.shiftType === 'active') {
      return <button onClick={this.handleClickUnassignOperator}>Unassign Driver</button>;
    } else if (this.props.shiftType === 'alertShift') {
      return <div>**Please select from the Available Drivers below.**</div>;
    }
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
        <div>Rounds: {this.props.rounds}</div>
        <div>Status: {shiftStatus}</div>
        {this.generateConditionalElement()}
      </div>
    );
  }
}

export default AdminClickedShiftDetailsAside;
