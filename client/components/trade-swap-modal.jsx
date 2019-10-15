import React from 'react';

class TradeSwapModal extends React.Component {

  render() {

    return (
      <div className="modalShadow" style={{ display: this.props.open ? 'block' : 'none' }}>
        <div className="modalBody modalShiftDetails">
          {this.props.open && this.props.children}
        </div>
      </div>
    );
  }

}

export default Modal;
