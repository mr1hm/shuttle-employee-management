import React from 'react';
import RouteBusDisplay from './route-bus-display';
import Modal from './admin-lines-buses-editModal';
import AdminRoutes from './admin-lines-buses';

export default class BusesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  render() {
    if (this.state.showModal) {
      return (
        <div className="container editModal">
          <Modal onClose={this.handleClick} showModal={this.state.showModal}>
          </Modal>/>
        </div>
      );
    }
    return (
      <tbody>
        <tr>
          <td className="busNumber" rowSpan="3"><RouteBusDisplay bus={this.props.routeInfo.bus_number}></RouteBusDisplay></td>
          <td>{this.props.routeInfo.start_time}</td>
          <td>{this.props.routeInfo.end_time}</td>
          <td>24 Rds</td>
          <td>Day Selection</td>
          <td>
            <button onClick={this.handleClick} className="btn btn-danger">EDIT</button>
          </td>
        </tr>
        <tr>
          <td className="startTimeDuration">{this.props.routeInfo.opening_duration + "min."}</td>
          <td className="endTimeDuration">{this.props.routeInfo.closing_duration + "min."}</td>
          <td className="rounds">30min</td>
          <td className="roundDuration">{this.props.routeInfo.round_dur}</td>
        </tr>
      </tbody>
    );
  }
}
