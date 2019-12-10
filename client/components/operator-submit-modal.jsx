import React from 'react';
import './operator-availability.css';

class SubmitModal extends React.Component {
  render() {
    return (
      <div className={this.props.submitShow ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <div className="d-flex justify-content-around">{this.props.children}</div>
        </section>
      </div>
    );
  }
}

export default SubmitModal;
