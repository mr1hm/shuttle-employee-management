import React from 'react';
import './admin-operator-availability.css';

class ChangeHoursModal extends React.Component {
  render() {
    return (
      <div className={this.props.showChangeHoursModal ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <div className="d-flex justify-content-around">{this.props.children}</div>
        </section>
      </div>
    );
  }
}

export default ChangeHoursModal;
