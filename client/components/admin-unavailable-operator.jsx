import React from 'react';

class AdminUnavailableOperator extends React.Component {
  renderUnavailableReasons() {
    const unavailableReasonElements = [];
    let reasons = this.props.unavailableReasons;
    for (let reasonIndex = 0; reasonIndex < reasons.length; reasonIndex++) {
      unavailableReasonElements.push(
        <li key={reasonIndex} className="text-danger">{reasons[reasonIndex]}</li>
      );
    }
    return unavailableReasonElements;
  }
  render() {
    return (
      <div className="card">
        <div className="card-header btn btn-light dropdown-toggle d-flex justify-content-center align-items-center border-0 px-0" type="button" data-toggle="collapse" data-target={'#operator' + this.props.id} aria-expanded="false" aria-controls="collapseExample">
          {this.props.name}
        </div>
        <div className="collapse" id={'operator' + this.props.id}>
          <div className="card card-body border-0 p-2">
            <ul className="pl-3">
              {this.renderUnavailableReasons()}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminUnavailableOperator;
