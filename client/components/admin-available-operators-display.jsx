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
    this.props.onClickAssignShift();
  }
  render() {
    return (
      <div
        key={this.props.id}
        id={this.props.id}
        onClick={this.handleClickExpand}
        className={`availableOperator border d-flex flex-column align-items-center p-1 ${this.state.expanded ? 'availableOperatorExpanded' : ''}`} >
        <div className='availableOperatorIconNameContainer w-100'>
          <FontAwesomeIcon icon={faAngleRight} className={`angleIcon ${this.checkIfExpanded()} mr-auto`} /> {this.props.name}
        </div>
        <div className='w-100'>{`Daily hours: ${this.props.dailyHours.toFixed(2)}`}</div>
        <div className='w-100'>{`Weekly hours: ${this.props.weeklyHours.toFixed(2)}`}</div>
        <button id={this.props.id} className="btn btn-success" onClick={this.props.onClickAssignShift} >Select Operator</button>
      </div>
    );
  }
}

export default AdminAvailableOperatorsDisplay;
