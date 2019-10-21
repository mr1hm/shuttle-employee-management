import React from 'react';

class AdminAvailableOperatorsDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickAssignShift = this.handleClickAssignShift.bind(this);
  }
  handleClickAssignShift() {
    this.props.onClickAssignShift();
  }
  render() {
    return (
      <div
        key={this.props.id}
        id={this.props.id}
        className="availableOperator rounded border d-flex flex-column align-items-center p-1 mr-1" >
        <div>{this.props.name}</div>
        <div>{`Total daily hours: ${this.props.dailyHours.toFixed(2)}`}</div>
        <div>{`Total weekly hours: ${this.props.weeklyHours.toFixed(2)}`}</div>
        <button id={this.props.id} className="btn btn-success" onClick={this.props.onClickAssignShift} >Select Operator</button>
      </div>
    );
  }
}

export default AdminAvailableOperatorsDisplay;
