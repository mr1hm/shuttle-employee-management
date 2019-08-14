import React from 'react';
import './post-modal.css';

const Modal = (props) => {
  return (
    <div className="modalShadow" style={{ display: props.open ? 'block' : 'none' }}>
      <div className="modalBody">
        <div className="modalClose" onClick={props.closeCallback}>X</div>
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
