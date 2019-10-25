import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

class AdminAvailableOperatorsDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.handleClickExpand = this.handleClickExpand.bind(this);
    this.handleClickAssignShift = this.handleClickAssignShift.bind(this);
  }
  checkIfExpanded() {
    if (this.state.expanded) {
      return 'angleIconRotate';
    }
    return '';
  }
  handleClickExpand() {
    this.setState({ expanded: !this.state.expanded });
  }
  handleClickAssignShift() {
    console.log('clicked: ', this.props.name, this.props.id);
    this.props.onClickAssignShift(this.props.name, this.props.id);
  }
  render() {
    return (
      <div
        key={this.props.id}
        id={this.props.id}
        className={`availableOperator border d-flex flex-column align-items-center p-1 ${this.state.expanded ? 'availableOperatorExpanded' : ''}`} >
        <div
          onClick={this.handleClickExpand}
          className='availableOperatorIconNameContainer w-100'>
          <FontAwesomeIcon icon={faAngleRight} className={`angleIcon ${this.checkIfExpanded()} mr-auto`} /> {this.props.name}
        </div>
        <div className='w-100'>{`Daily hours: ${this.props.dailyHours.toFixed(2)}`}</div>
        <div className='w-100'>{`Weekly hours: ${this.props.weeklyHours.toFixed(2)}`}</div>
        <button id={this.props.id} className="btn btn-success" data-toggle="modal" data-target="#confirmModal" onClick={this.handleClickAssignShift} >Select Operator</button>
      </div>
    );
  }
}

export default AdminAvailableOperatorsDisplay;
