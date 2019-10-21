import React from 'react';

class TradeNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newShifts: '',
      selectedDriver: ''
    };
  }
  componentDidMount() {
    debugger;
    const newShiftsAndSelectedDriver = this.props.location.state;

  }
  render() {
    return (
      <div className="container">
        <div className="row">

        </div>
      </div>
    );
  }
}

export default TradeNotification;
