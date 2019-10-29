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
        Round breakdown:
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
    if (this.props.shiftType === 'active') {
      shiftStatus = 'Scheduled';
    }
    return (
      <div className="card">
        <div className="card-header btn btn-light dropdown-toggle d-flex justify-content-center align-items-center border-0 px-0" type="button" data-toggle="collapse" data-target={'#round' + this.props.rounds[0].id} aria-expanded="false" aria-controls="collapseExample">
          {`${this.props.lineBus}: ${this.props.shiftTime}`}
        </div>
        <div className="collapse" id={'round' + this.props.rounds[0].id}>
          <div className="card card-body border-0">
            <div>Operator: {this.props.userId === 1 ? 'unassigned' : displayName}</div>
            <div>ID#: {this.props.userId === 1 ? 'unassigned' : this.props.userId}</div>
            <div>Status: {shiftStatus}</div>
            <div>Rounds: {this.props.rounds.length}</div>
            {this.checkIfAssignedShift()}
          </div>
        </div>
      </div>
    );
  }
}

export default AdminClickedShiftDetailsAside;
