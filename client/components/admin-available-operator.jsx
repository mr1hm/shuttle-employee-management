import React from 'react';

class AdminAvailableOperator extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickAssignShift = this.handleClickAssignShift.bind(this);
  }
  handleClickAssignShift() {
    console.log('clicked: ', this.props.name, this.props.id);
    this.props.onClickAssignShift(this.props.name, this.props.id);
  }
  render() {
    return (
      <div className="card rounded-0">
        <div className="card-header btn btn-light dropdown-toggle d-flex justify-content-center align-items-center border-0 px-0 rounded-0" type="button" data-toggle="collapse" data-target={'#operator' + this.props.id} aria-expanded="false" aria-controls="collapseExample">
          {this.props.name}
        </div>
        <div className="collapse" id={'operator' + this.props.id}>
          <div className="card card-body border-0">
            <div className='w-100'>{`Daily hours: ${this.props.dailyHours.toFixed(2)}`}</div>
            <div className='w-100'>{`Weekly hours: ${this.props.weeklyHours.toFixed(2)}`}</div>
            <button id={this.props.id} className="btn btn-success mt-1" data-toggle="modal" data-target="#confirmModal" onClick={this.handleClickAssignShift} >Select Operator</button>
          </div>
        </div>
      </div>
    );
  }
}
export default AdminAvailableOperator;
