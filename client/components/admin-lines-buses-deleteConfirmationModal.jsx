import React from 'react';
import Lines from './admin-lines-buses-lines';
import { Link } from 'react-router-dom';

export default class DeleteConfirmationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionInfo: null,
      routeIDArr: [],
      lineIDArr: []
    };
    this.getSessionInfo = this.getSessionInfo.bind(this);
    this.getSessionRouteIDsAndBusIDs = this.getSessionRouteIDsAndBusIDs.bind(this);
  }

  componentDidMount() {
    this.getSessionInfo();
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSessionID !== prevProps.selectedSessionID) {
      this.setState({ selectedSessionID: this.props.selectedSessionID }, this.getSessionInfo);
    }
  }

  getSessionRouteIDsAndBusIDs() {
    const { sessionInfo } = this.state;
    let routeIDArr = [];
    sessionInfo.forEach(session => routeIDArr.push(session.routeID));
    this.setState({ routeIDArr });
  }

  getSessionInfo() {
    const body = { sessionInfo: this.props.selectedSessionID };
    const init = { method: 'POST', body: JSON.stringify(body) };
    fetch(`/api/admin-lines-buses-sessions.php`, init)
      .then(response => response.json())
      .then(sessionInfo => {
        console.log('getSessionInfo: ', sessionInfo);
        this.setState({ sessionInfo }, this.getSessionRouteIDsAndBusIDs);
      })
      .catch(error => console.error(error));
  }

  render() {
    const { line, busInfo, selectedSessionID, deleteStatus } = this.props;
    if (deleteStatus === 'session') {
      return (
        <div className="container deleteConfirmationModal">
          <div className="row">
            <div className="col d-flex justify-content-center">
              <h3 className="deleteConfirmationModalHeader">Are you sure you want to delete this Session?</h3>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center">
              {/* <Link to={{
                pathname: `/admin-routes/`
              }}
              onClick={() => this.props.deleteSession(selectedSessionID, this.state.routeIDArr)}
              className="btn btn-success w-100 deleteConfirmationModalConfirmBtn">
                CONFIRM
              </Link> */}
              <button className="btn btn-success w-100 deleteConfirmationModalConfirmBtn" onClick={() => this.props.deleteSession(selectedSessionID, this.state.routeIDArr)}>CONFIRM</button>
            </div>
            <div className="col d-flex justify-content-center">
              <button className="btn btn-warning w-100 deleteConfirmationModalCancelBtn" onClick={this.props.handleDeleteSessionClick}>CANCEL</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="container deleteConfirmationModal">
        <div className="row">
          <div className="col d-flex justify-content-center">
            {this.state.deleteStatus === 'bus' ? <h3 className="deleteConfirmationModalHeader">Are you sure you want to delete Bus {this.props.busInfo.busNumber}?</h3>
              : <h3 className="deleteConfirmationModalHeader">Are you sure you want to delete Line {this.props.line.line_name}?</h3>}
          </div>
        </div>
        <div className="row">
          <div className="col d-flex justify-content-center">
            {this.state.deleteStatus === 'bus' ? <button className="btn btn-success w-100 deleteConfirmationModalConfirmBtn" onClick={() => this.props.deleteBus(busInfo.busID)}>CONFIRM</button>
              : <button className="btn btn-success w-100 deleteConfirmationModalConfirmBtn" onClick={() => this.props.deleteLine(line.real_route_id, line.sessionID)}>CONFIRM</button>}
          </div>
          <div className="col d-flex justify-content-center">
            {this.state.deleteStatus === 'bus' ? <button className="btn btn-warning w-100 deleteConfirmationModalCancelBtn" onClick={this.props.handleDeleteBusClicked}>CANCEL</button>
              : <button className="btn btn-warning w-100 deleteConfirmationModalCancelBtn" onClick={this.props.handleDeleteLine}>CANCEL</button>}
          </div>
        </div>
      </div>
    );
  }
}
