import React from 'react';
import './operator-availability.css';

class ParameterModal extends React.Component {
  render() {
    return (
      <div className={this.props.parameterShow ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <div className="d-flex justify-content-around">{this.props.children}</div>
          <div className="d-flex justify-content-center mt-4">
            <button className="btn btn-secondary center-block mb-3" onClick={this.props.closeParameter}>Update</button>
            <button className="btn btn-primary center-block mb-3 ml-3" onClick={this.props.parameterCancel}>CANCEL</button>
          </div>
        </section>
      </div>
    );
  }
}

export default ParameterModal;
