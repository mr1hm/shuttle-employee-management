import React from 'react';
import './operator-availability.css';

class ErrorModal extends React.Component {
  render() {
    return (
      <div className={this.props.errorShow ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <div className="d-flex justify-content-around">{this.props.children}</div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary center-block mb-3" onClick={this.props.closeError}>Exit</button>
          </div>
        </section>
      </div>
    );
  }
}

export default ErrorModal;
