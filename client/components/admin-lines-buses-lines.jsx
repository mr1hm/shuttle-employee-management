import React from 'react';
import TopMenuShift from './topmenu/topmenu-shift';
import TopMenuGeneral from './topmenu/topmenu-general';
import TopMenuHamburger from './topmenu/topmenu-hamburger';
import Nav from './topmenu/range-nav-bar';
import RouteBusDisplay from './route-bus-display';
import BusesTable from './admin-lines-buses-busesTable';
import AddBus from './admin-lines-buses-addBus';
import GapsModal from './admin-lines-buses-viewGaps';
import './linesBusesStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCaretUp, faBus, faCaretDown, faEdit, faTrash, faUserTie } from '@fortawesome/free-solid-svg-icons';
import AdminRoutes from './admin-lines-buses';
import EditLine from './admin-lines-buses-editLine';
import DeleteConfirmationModal from './admin-lines-buses-deleteConfirmationModal';

export default class Lines extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      busDetailsClicked: false,
      addBusClicked: false,
      busAdded: false,
      deletedLineName: null,
      editLineClicked: false,
      specialDriverRequired: this.props.line.specialDriver === 'True',
      sessionName: '',
      line: this.props.line,
      deleteLineClicked: false,
      deleteBusClicked: false
    };
    this.displayBusDetails = this.displayBusDetails.bind(this);
    this.handleAddBusButtonClick = this.handleAddBusButtonClick.bind(this);
    this.deleteLine = this.deleteLine.bind(this);
    this.handleEditLineClicked = this.handleEditLineClicked.bind(this);
    this.handleDeleteLine = this.handleDeleteLine.bind(this);
  }

  componentDidUpdate(prevProps) {
    let specialDriverRequired = this.props.line.specialDriver === 'True';
    if (this.state.specialDriverRequired !== specialDriverRequired) {
      this.setState({
        specialDriverRequired
      });
    }
    // if (prevProps.sessions.length !== this.props.sessions.length || prevProps.linesBusesInfo.length !== this.props.linesBusesInfo.length) {
    //   this.getSessionName();
    // }
  }

  componentDidMount() {
    this.getSessionName();
  }

  getSessionName() {
    let currentSession = this.props.sessions.find(session => {
      return this.props.line.sessionID === session.id;
    });
    this.setState({
      sessionName: currentSession.name
    });
  }

  handleAddBusButtonClick() {
    this.setState({
      addBusClicked: !this.state.addBusClicked
    });
  }

  handleEditLineClicked() {
    this.setState({
      editLineClicked: !this.state.editLineClicked
    });
  }

  displayBusDetails() {
    this.setState({ busDetailsClicked: !this.state.busDetailsClicked });
  }

  handleDeleteLine() {
    this.setState({
      deleteLineClicked: !this.state.deleteLineClicked
    })
  }

  deleteLine(lineID, sessionID) {
    let busIDArr = [];
    let busIDs = this.props.line.activeBuses.forEach(buses => { // another bug. if deleting line from All Sessions tab, it will get/render all the lines from only that session.
      busIDArr.push(buses.busID); // DELETES BUS AS WELL - IT WORKS!!d
    });
    console.log(busIDArr);
    const body = {
      routeID: lineID,
      buses: busIDArr
    };
    const init = {
      method: 'DELETE',
      body: JSON.stringify(body)
    };
    fetch('api/admin-lines-buses.php', init)
      .then(response => response.json())
      .then(deletedLine => {
        this.setState({
          deletedLineName: this.props.line.line_name // not working
        });
        if (this.props.currentSession === 'All Sessions') {
          this.props.getLinesBusesInfo();
        } else {
          this.props.getLinesBusesInfo({ session_id: sessionID });
        }
        this.props.operationsHistoryMethod();
      })
      .catch(error => console.error(error));
    console.log('LINE DELETED');
  }

  render() {
    const { line } = this.props;
    const { activeBuses } = this.props.line;
    if (!this.props.line.real_route_id) {
      return null;
    }
    if (this.state.deleteLineClicked) {
      return (
        <DeleteConfirmationModal handleDeleteLine={this.handleDeleteLine} deleteLine={this.deleteLine} line={line} />
      );
    }
    if (this.state.editLineClicked) {
      return (
        <div id="accordion">
          <EditLine currentSession={this.props.currentSession} busDetailsClicked={this.state.busDetailsClicked} displayBusDetails={this.displayBusDetails} getLinesBusesInfo={this.props.getLinesBusesInfo} handleEditLineClicked={this.handleEditLineClicked} editLineClicked={this.state.editLineClicked} line={line} />

          <div id={'collapse' + line.line_name} className="collapse" aria-labelledby={'heading' + line.line_name}> {/* data-parent="#accordion" was making things weird */}

            <div className="row">
              <div className="col">
                <div id="accordion">
                  <AddBus currentSession={this.props.currentSession} getLinesBusesInfo={this.props.getLinesBusesInfo} accordionID={this.props.accordionID} line={line} handleAddBusButtonClick={this.handleAddBusButtonClick} addBusClicked={this.state.addBusClicked} addBus={this.props.addBus} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="card col-12">
                <div className="card-header">
                  Active Buses - <span className="lineID">Line/Route ID: {line.real_route_id}</span>
                </div>
                <table className="card-table table">
                  <thead>
                    <tr>
                      <th scope="col">Bus Number</th>
                      <th scope="col">Start Time</th>
                      <th scope="col">Rounds</th>
                      <th scope="col">End Time</th>
                      <th scope="col">Days</th>
                      <th scope="col">Gap</th>
                      <th scope="col" className="text-center">Operations</th>
                    </tr>
                  </thead>
                  {activeBuses.map((bus, index) => {
                    return <BusesTable key={bus.busNumber + index} handleGapsModal={this.props.handleGapsModal} showGapsModal={this.props.showGapsModal} selectedSessionID={this.props.selectedSessionID} linesBusesInfo={this.props.linesBusesInfo} key={bus.busNumber + index} getLinesBusesInfo={this.props.getLinesBusesInfo} editBusClicked={this.state.editBusClicked} handleEditBusClicked={this.handleEditBusClicked} line={line} busInfo={bus} />;
                  }
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div id="accordion">
        <div className="card" id={line.real_route_id}>
          <div className="card-header lineCardHeader" id={'heading' + line.line_name}>
            <div className="row w-100 align-items-center lineHeaderFirstRow">
              <div className={`col-2 lineName ${line.line_name}`}>
                  Line {this.state.specialDriverRequired ? <FontAwesomeIcon className="specialDriverIcon ml-3" icon={faUserTie} /> : null}
              </div>
              <div className="col">Status</div>
              <div className="col">Round Duration</div>
              <div className="col">Public</div>
              <div className="col">Regular Service</div>
              <div className="col d-flex justify-content-center">Session</div>
              <div className="col d-flex justify-content-center">
                {activeBuses.length === 0 ? <FontAwesomeIcon className="busInactiveIcon" icon={faBus} /> : <FontAwesomeIcon className="busActiveIcon" icon={faBus} />}
              </div>
              <div className="col d-flex justify-content-center">
                <button onClick={this.handleEditLineClicked} className="editLineBtn btn btn-warning"><FontAwesomeIcon icon={faEdit} /></button>
              </div>
            </div>
            <div className="row w-100 align-items-center">
              <div className="col-2">
                <RouteBusDisplay route={line.line_name} />
              </div>
              <div className="col">
                {line.status === 'active' ? <FontAwesomeIcon className="lineActiveIcon" icon={faCircle} /> : <FontAwesomeIcon className="lineInactiveIcon" icon={faCircle} />}
                {line.status}
              </div>
              <div className="col">{`${line.roundDuration}min`}</div>
              <div className="col">{line.public}</div>
              <div className="col">{line.regularService}</div>
              <div className="col d-flex justify-content-center">{this.state.sessionName}</div>
              <div className="col">
                <button className="btn btn-link" type="button" data-toggle="collapse"
                  name={`busDetailsClicked${line.route_id}`} href={'#collapse' + line.line_name} onClick={this.displayBusDetails} aria-expanded="true" aria-controls={'collapse' + line.line_name}>
                      Bus Details
                  {this.state.busDetailsClicked ? <FontAwesomeIcon className="busDetailsIcon ml-1" icon={faCaretUp} /> : <FontAwesomeIcon className="busDetailsIcon ml-1" icon={faCaretDown} />}
                </button>
              </div>
              <div className="col d-flex justify-content-center">
                <button onClick={this.handleDeleteLine} className="deleteLineBtn btn btn-danger">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          </div>

          <div id={'collapse' + line.line_name} className="collapse" aria-labelledby={'heading' + line.line_name}> {/* data-parent="#accordion" was making things weird */}

            <div className="row">
              <div className="col">
                <div id="accordion">
                  <AddBus currentSession={this.props.currentSession} getLinesBusesInfo={this.props.getLinesBusesInfo} accordionID={this.props.accordionID} line={line} handleAddBusButtonClick={this.handleAddBusButtonClick} addBusClicked={this.state.addBusClicked} addBus={this.props.addBus} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="card col-12">
                <div className="card-header">
                    Active Buses - <span className="lineID">Line/Route ID: {line.real_route_id}</span>
                </div>
                <table className="card-table table busTable">
                  <thead>
                    <tr>
                      <th scope="col">Bus Number</th>
                      <th scope="col">Start Time</th>
                      <th scope="col">Rounds</th>
                      <th scope="col">End Time</th>
                      <th scope="col">Days</th>
                      <th scope="col">Gap</th>
                      <th scope="col" className="text-center">Operations</th>
                    </tr>
                  </thead>
                  {activeBuses.map((bus, index) => {
                    return <BusesTable key={bus.busNumber + index} selectedSessionID={this.props.selectedSessionID} currentSession={this.props.currentSession} linesBusesInfo={this.props.linesBusesInfo} key={bus.busNumber + index} getLinesBusesInfo={this.props.getLinesBusesInfo} editBusClicked={this.state.editBusClicked} handleEditBusClicked={this.handleEditBusClicked} line={line} busInfo={bus} />;
                  })
                }
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
