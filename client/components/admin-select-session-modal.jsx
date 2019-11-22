import React from 'react';
import './admin-operator-availability.css';

class SelectSessionModal extends React.Component {
  render() {
    return (
      <div className={this.props.showSelectSessionModal ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <div className="d-flex justify-content-around">{this.props.children}</div>
        </section>
      </div>
    );
  }
}

export default SelectSessionModal;
