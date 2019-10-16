import React from 'react';
import SingleShift from './shifts/day/single-shift';

class TradeSwap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { shiftsDetailsInfo } = this.props;
    return (

      <div className="container d-flex flex-column justify-content-around h-100">
        <div className="row">
          <h1> Trade/Swap </h1>
        </div>
        <div className="row justify-content-center">
          <div className="btn-group w-50">
            <button className="btn btn-secondary btn-lg dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Select Coworker
            </button>
            <div className="dropdown-menu w-100">
              ...
            </div>
          </div>
        </div>
        <div className="row justify-content-center h-25">
          <h3>Shift Details</h3>
        </div>
        <div className="row h-25 justify-content-center">
          <div className="col h-50 d-flex justify-content-center ">
            <button type="button" className="btn btn-lg btn-light w-75">Cancel</button>
          </div>
          <div className="col h-50 d-flex justify-content-center">
            <button type="button" className="btn btn-lg btn-success w-75">Trade</button>
          </div>
          <div className="col h-50 d-flex justify-content-center">
            <button type="button" className="btn btn-lg btn-primary w-75">Swap</button>
          </div>
        </div>

        {/* {shiftsDetailsInfo[0] && shiftsDetailsInfo[0].status === 'posted'
            ? 'Do you really want to cancel this/these post(s)?' : 'Do you really want to post this/these shift(s)?'}</h2>
        <table className='table table-striped'>
          <tbody>
            {
              shiftsDetailsInfo.map((shifts, index) => {

                return (

                  < OneOfMyShifts
                    key={index}
                    shifts={shifts}
                    openDetails={this.openModal}
                    view={this.props.view}
                    modalStatus={this.state.isModalOpen}
                    defaultDate={this.props.unixDate}

                  />
                );
              })
            }
          </tbody>
        </table>
        <div className="form-group box">
          <label className="boxComment" htmlFor="comment ">Comment:</label>
          <textarea onChange={this.handleTextArea} className="form-control ml-3" rows="5" id="comment"></textarea>
        </div>
        <p><button className="modalCancelButton btn-dark" onClick={() => this.closeModal()}>Back to My Shifts</button></p>
        <p onClick={event => this.handleTransactionLog(event)} ><button className="modalConfirmButton btn-primary" onClick={this.handlePostButtonConfirmation} >
          {shiftsDetailsInfo[0] && shiftsDetailsInfo[0].status === 'posted' ? 'Yes, I want to cancel' : 'Yes, I want to post'}</button></p> */}
      </div>
    );
  }
}

export default TradeSwap;
