import React from 'react';
import RouteBusDisplay from './route-bus-display';
import EditBusModal from './admin-lines-buses-editBus';
import AdminRoutes from './admin-lines-buses';

export default class BusesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      busExistsOnRoute: false,
      editBusClicked: false
    }
    this.handleEditBusClicked = this.handleEditBusClicked.bind(this);
    this.closeEditBus = this.closeEditBus.bind(this);
    // this.handleEditClick = this.handleEditClick.bind(this);
  }

  checkForActiveBuses() {
    if (line.buses.busNumber)
    this.setState({
      busExistsOnRoute: true
    })
  }

  closeEditBus() {
    this.setState({
      editBusClicked: false
    })
  }

  // handleEditBusClick() {
  //   this.setState({
  //     showModal: !this.state.showModal
  //   })
  // }

  handleEditBusClicked() {
    this.setState({
      editBusClicked: !this.state.editBusClicked
    })
  }

  render() {
    const { line } = this.props;
    const { busInfo } = this.props;
    console.log(busInfo);
    if (this.state.showModal) {
      return (
        <div className="container editBusModal">
          <EditBusModal busInfo={busInfo} editBusClicked={this.props.editBusClicked} handleEditBusClicked={this.handleEditBusClicked} lineID={line.real_route_id} line={line} onClose={this.handleEditBusClick} showModal={this.state.showModal} />
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
    if (this.state.editBusClicked) {
      return (
        <EditBusModal getLinesBusesInfo={this.props.getLinesBusesInfo} busInfo={busInfo} editBusClicked={this.state.editBusClicked} closeEditBus={this.closeEditBus} handleEditBusClicked={this.handleEditBusClicked} lineID={line.real_route_id} line={line} onClose={this.handleEditBusClick} showModal={this.state.showModal} />
      );
    }
    return (
      <tbody>
        <tr>
          <td className="busNumber" rowSpan="3">
            <RouteBusDisplay bus={busInfo.busNumber}></RouteBusDisplay>
          </td>
          <td>{busInfo.startTime}</td>
          <td>{busInfo.endTime}</td>
          {/* <td>24 Rds</td> */}
          <td>{busInfo.daysActive}</td>
          <td>{busInfo.gap}</td>
          <td>
            <button onClick={this.handleEditBusClicked} className="btn btn-primary">EDIT</button>
          </td>
        </tr>
        <tr>
          <td className="startTimeDuration">{busInfo.openingDuration + "min."}</td>
          <td className="endTimeDuration">{busInfo.closingDuration + "min."}</td>
          {/* <td>{busInfo.gapDuration}</td> */}
          {/* <td className="roundsDuration">30min</td> */}
          <td></td>
          <td></td>
          <td>
            <button className="btn btn-danger">DELETE</button>
          </td>
        </tr>
      </tbody>
    );
  }
}