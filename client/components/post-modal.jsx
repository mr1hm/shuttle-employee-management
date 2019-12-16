import React from 'react';
import './post-modal.css';

class Modal extends React.Component {

  render() {

    return (
      <div className="modalShadow" style={{ display: this.props.open ? 'block' : 'none' }}>
        <div className="modalBody"  >
          {this.props.children}
        </div>
      </div>
    );
  }

}

export default Modal;
