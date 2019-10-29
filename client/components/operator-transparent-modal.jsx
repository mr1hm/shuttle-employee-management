import React from 'react';
import './operator-availability2.css';

class TransparentModal extends React.Component {
  render() {
    return (
      <div className={this.props.show ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <div className="d-flex justify-content-around">{this.props.children}</div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary center-block mb-3" onClick={this.props.close}>Add Time</button>
          </div>
        </section>
      </div>
    );
  }
}

export default TransparentModal;
