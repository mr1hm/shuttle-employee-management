import React from 'react';

export default class LiveFieldStatusTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeBuses: null
    }
  }

  render() {
    const { bus } = this.props;
    const { lineBusData } = this.props;
    return (
        <tr>
          <td>{lineBusData.line_name}</td>
          <td>{bus.busNumber}</td>
          <td>{bus.vehicleID}</td>
          <td>Shift Time and Operator Name</td>
        </tr>
    );
  }
}
