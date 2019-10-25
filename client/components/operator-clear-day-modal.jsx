import React from 'react';
import './operator-availability.css';

class ClearDayModal extends React.Component {
  render() {
    return (
      <div className={this.props.clearShow ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <div className="d-flex justify-content-around">{this.props.children}</div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-secondary center-block mb-3 ml-3" onClick={this.props.closeClear}>Clear</button>
            <button className="btn btn-primary center-block mb-3 ml-3" onClick={this.props.cancelClear}>CANCEL</button>
          </div>
        </section>
      </div>
    );
  }
}

export default ClearDayModal;
