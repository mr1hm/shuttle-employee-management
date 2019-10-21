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
        className="availableOperator rounded border d-flex flex-column align-items-center p-1"
        onClick={this.props.onClickAssignShift} >
        <div>{this.props.name}</div>
        <div>{`Total daily hours: ${this.props.dailyHours}`}</div>
        <div>{`Total weekly hours: ${this.props.weeklyHours}`}</div>
      </div>
    );
  }
}

export default AdminAvailableOperatorsDisplay;
