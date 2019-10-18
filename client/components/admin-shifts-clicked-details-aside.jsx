import React from "react";
import './admin-shifts-display.css';

class AdminClickedShiftDetailsAside extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const lastName = this.props.userName.last;
    const firstName = this.props.userName.first;
    const displayName = lastName + ", " + firstName;
    let shiftStatus;
    if (this.props.shiftType === "active") {
      shiftStatus = "Scheduled";
    } else shiftStatus = "Unscheduled";
    return (
      <div className="adminShiftDetails">Shift Details
        <div>Scheduled Driver: {displayName}</div>
        <div>ID#: {this.props.userId}</div>
        <div>Shift Time: {this.props.shiftTime}</div>
        <div>Rounds: {this.props.rounds}</div>
        <div>Shift Status: {shiftStatus}</div>
      </div>
    );
  }
}

export default AdminClickedShiftDetailsAside;