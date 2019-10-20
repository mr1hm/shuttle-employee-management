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
        className="availableOperator rounded border d-flex justify-content-center align-items-center"
        onClick={this.props.onClickAssignShift} >
        {this.props.name}
      </div>
    );

  }
}

export default AdminAvailableOperatorsDisplay;
