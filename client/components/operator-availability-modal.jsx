import React from 'react';

class OperatorAvailabilityModal extends React.Component {
  render() {
    if (!this.props.open) {
      return null;
    }
    return <div style={{ backgroundColor: 'pink', width: '5.4%', height: '5vh', border: '1px solid black' }}>Testing Functionality</div>;
  }
}

export default OperatorAvailabilityModal;
