import React from 'react';
import './admin-operator-availability.css';

class AddUserModal extends React.Component {
  render() {
    return (
      <div className={this.props.showAddUserModal ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <div className="d-flex justify-content-around">{this.props.children}</div>
          {/* <div className="d-flex justify-content-center">
            <button className="btn btn-primary center-block mb-3" onClick={this.props.submitUserInfo}>Submit</button>
          </div> */}
        </section>
      </div>
    );
  }
}

export default AddUserModal;
