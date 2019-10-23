import React from 'react';
import './operator-availability.css';

class OperatorAvailabilityModal extends React.Component {
  render() {
    return (
      <div className={this.props.show ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <div style={{ fontWeight: 'bold' }}>{this.props.day}</div>
          <div className="d-flex justify-content-around">{this.props.children}</div>
          <button className="col" onClick={this.props.close}>Add Time</button>
        </section>
      </div>
    );
  }
}

export default OperatorAvailabilityModal;
