import React from 'react';
import './operator-availability.css';

class OperatorAvailabilityModal extends React.Component {
  render() {
    return (
      <div className={this.props.show ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          {this.props.children}
          <button onClick={this.props.close}>Add Time</button>
        </section>
      </div>
    );
  }
}

export default OperatorAvailabilityModal;
