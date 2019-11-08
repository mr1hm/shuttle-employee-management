import React from 'react';
import RouteBusDisplay from './route-bus-display';
import EditBusModal from './admin-lines-buses-editBus';
import AdminRoutes from './admin-lines-buses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default class BusesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      busExistsOnRoute: false,
      editBusClicked: false,
      checkLinesBusesInfo: null,
      prevDeletedBus: null
    };
    this.handleEditBusClicked = this.handleEditBusClicked.bind(this);
    this.closeEditBus = this.closeEditBus.bind(this);
    this.deleteBus = this.deleteBus.bind(this);
  }

  // checkForActiveBuses() {
  //   if (line.buses.busNumber) {
  //     this.setState({
  //       busExistsOnRoute: true
  //     });
  //   }
  // }

  deleteBus(busID, sessionID) {
    const body = {
      id: busID
    };
    const init = {
      method: 'DELETE',
      body: JSON.stringify(body)
    };
    fetch(`api/admin-lines-buses.php`, init)
      .then(response => response.json())
      .then(busDeleted => {
        this.setState({
          prevDeletedBus: busDeleted
        }, () => {
          if (this.props.selectedSessionID !== null) {
            this.props.getLinesBusesInfo({ session_id: this.props.selectedSessionID });
          } else {
            this.props.getLinesBusesInfo();
          }
        });
        console.log('deleted', busDeleted);
      })
      .catch(error => console.error(error));
  }

  closeEditBus() {
    this.setState({
      editBusClicked: false
    });
  }

  handleEditBusClicked() {
    this.setState({
      editBusClicked: !this.state.editBusClicked
    });
  }

  render() {
    const { line } = this.props;
    const { busInfo } = this.props;
    if (this.state.showModal) {
      return (
        <div className="container editBusModal">
          <EditBusModal closeEditBus={this.closeEditBus} busInfo={busInfo} editBusClicked={this.props.editBusClicked} handleEditBusClicked={this.handleEditBusClicked} lineID={line.real_route_id} line={line} onClose={this.handleEditBusClick} showModal={this.state.showModal} />
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
        <EditBusModal currentSession={this.props.currentSession} getLinesBusesInfo={this.props.getLinesBusesInfo} busInfo={busInfo} editBusClicked={this.state.editBusClicked} closeEditBus={this.closeEditBus} handleEditBusClicked={this.handleEditBusClicked} lineID={line.real_route_id} line={line} onClose={this.handleEditBusClick} showModal={this.state.showModal} />
      );
    }
    return (
      <tbody>
        <tr className="busTableInfo">
          <td className="busNumber" rowSpan="3">
            <RouteBusDisplay bus={busInfo.busNumber}></RouteBusDisplay>
          </td>
          <td>{busInfo.startTime}</td>
          <td>{busInfo.rounds}</td>
          <td>{busInfo.endTime}</td>
          <td>{busInfo.daysActive}</td>
          <td>{busInfo.gap}</td>
          <td className="d-flex justify-content-center">
            <button onClick={this.handleEditBusClicked} className="busTableEditIconBtn btn btn-warning"><FontAwesomeIcon icon={faEdit} /></button>
          </td>
        </tr>
        <tr className="busTableInfo">
          <td className="startTimeDuration">{`${busInfo.openingDuration}min`}</td>
          <td></td>
          <td className="endTimeDuration">{`${busInfo.closingDuration}min`}</td>
          <td></td>
          <td>{busInfo.gapDuration}</td>
          <td className="d-flex justify-content-center">
            <button onClick={() => this.deleteBus(busInfo.busID)} className="busTableDeleteIconBtn btn btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
          </td>
        </tr>
      </tbody>
    );
  }
}
