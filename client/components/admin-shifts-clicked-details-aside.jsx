import React from 'react';
import './admin-shifts-display.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

class AdminClickedShiftDetailsAside extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roundIdsChecked: [],
      roundTimesChecked: []
    };
    this.handleClickUnassignSubmit = this.handleClickUnassignSubmit.bind(this);
    this.onRoundCheckboxChange = this.onRoundCheckboxChange.bind(this);
  }
  onRoundCheckboxChange(e) {
    let roundIds = this.state.roundIdsChecked;
    let roundTimes = this.state.roundTimesChecked;
    if (e.target.checked) {
      roundIds.push(e.target.id);
      roundTimes.push(e.target.value);
    } else {
      let roundIndex = roundIds.indexOf(e.target.id);
      roundIds.splice(roundIndex, 1);
      roundTimes.splice(roundIndex, 1);
    }
    this.setState({
      roundIdsChecked: roundIds,
      roundTimesChecked: roundTimes
    });
    console.log('roundIdsChecked: ', roundIds, 'roundTimesChecked: ', roundTimes);
  }
  handleClickUnassignSubmit(e) {
    e.preventDefault();
    const userName = `${this.props.userName.last}, ${this.props.userName.first}`;
    this.props.operatorSelected(userName, this.props.userId);
    this.props.onClickUnassignOperator(this.state.roundIdsChecked, this.state.roundTimesChecked);
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
      <form className="roundDetails form-group form-check" onSubmit={this.handleClickUnassignSubmit}>
        Round breakdown:
        {this.props.rounds.map(round =>
          <div key={round.id} className="roundDetailContainer">
            <input
              id={round.id}
              type="checkbox"
              className="form-check-input"
              value={`${this.props.lineBus}: ${round.roundTime}`}
              onChange={this.onRoundCheckboxChange}/>
            <label className="roundTime form-check-label" htmlFor={round.id}>{round.roundTime}</label>
          </div>)}
        <button
          type="submit"
          className="btn btn-danger"
          data-toggle="modal"
          data-target="#confirmModal" >
          Unassign Shifts
        </button>
      </form>
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
