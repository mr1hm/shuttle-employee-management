import React from 'react';
import './editBusModal.css';

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.showModal) {
      return null;
    }
    return (
      <>
        <div>
          {this.props.children}
          <div className="row">
            <div className="offset-10 col-2">
              <button onClick={() => this.props.onClose()} className="closeModal btn btn-danger">X</button>
            </div>
          </div>
          <div className="row editRow">

          </div>
          <div className="row">
            <div className="offset-10 col-2">
              <button className="saveChangesBtn btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </>
      );
    }
  }
