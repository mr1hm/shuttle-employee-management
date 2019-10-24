import React from 'react';
import './operator-availability.css';

class SelectAvailabilityModal extends React.Component {
  render() {
    return (
      <div className={this.props.show ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <div className='d-flex justify-content-center mt-3'>
            <div style={{ fontWeight: 'bold' }}>{this.props.day}</div>
          </div>
          <div className="d-flex justify-content-around">{this.props.children}</div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary center-block mb-3" onClick={this.props.close}>Add Time</button>
          </div>
        </section>
      </div>
    );
  }
}

export default SelectAvailabilityModal;
