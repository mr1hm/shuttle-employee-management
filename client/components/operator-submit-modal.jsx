import React from 'react';
import './operator-availability.css';

class SubmitModal extends React.Component {
  render() {
    return (
      <div className={this.props.submitShow ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <div className="d-flex justify-content-around">{this.props.children}</div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary center-block mb-3" onClick={this.props.submitAndClose}>Submit</button>
            <button className="btn btn-primary center-block mb-3 ml-3" onClick={this.props.cancelClear}>CANCEL</button>
          </div>
        </section>
      </div>
    );
  }
}

export default SubmitModal;
