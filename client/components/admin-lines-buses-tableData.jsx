import React from 'react';
import RouteBusDisplay from './route-bus-display';
import EditBusModal from './admin-lines-buses-editBusModal';
import AdminRoutes from './admin-lines-buses';

export default class BusesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      busExistsOnRoute: false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  checkForActiveBuses() {
    if (line.buses.busNumber)
    this.setState({
      busExistsOnRoute: true
    })
  }

  handleClick() {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  render() {
    const { line } = this.props;
    const { busInfo } = this.props;
    console.log(busInfo);
    if (this.state.showModal) {
      return (
        <div className="container editModal">
          <EditBusModal onClose={this.handleClick} showModal={this.state.showModal} />

        </div>
      );
    } else if (!line.line_name) {
      return null;
    }
    if (line.activeBuses.length === 0) {
      return (
        <tbody>
          <tr>
            <td className="busNumber" rowSpan="3">THERE ARE NO ACTIVE BUSES</td>
          </tr>
        </tbody>
      );
    }
    return (
      <tbody>
        <tr>
          <td className="busNumber" rowSpan="3">
            <RouteBusDisplay bus={busInfo.busNumber}></RouteBusDisplay>
            <p>Bus ID: 1</p>
          </td>
          <td>{busInfo.startTime}</td>
          <td>{busInfo.endTime}</td>
          {/* <td>24 Rds</td> */}
          <td>Day Selection</td>
          <td>GAP TIME</td>
          <td>
            <button onClick={this.handleClick} className="btn btn-danger">EDIT</button>
          </td>
        </tr>
        <tr>
          <td className="startTimeDuration">{line.opening_duration + "min."}</td>
          <td className="endTimeDuration">{line.closing_duration + "min."}</td>
          {/* <td className="roundsDuration">30min</td> */}
        </tr>
      </tbody>
    );
  }
}
