import React from 'react';
import RouteBusDisplay from './route-bus-display';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default class GapsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linesBusesInfo: null,
      deletedGapID: null,
      addNewGapClicked: false,
      gapThatWasAdded: null,
      newGap: {
        busID: null,
        gapStartTime: null,
        gapDuration: null,
        newGap: 1
      }
    };
    this.deleteBusGap = this.deleteBusGap.bind(this);
    this.handleAddNewGapClick = this.handleAddNewGapClick.bind(this);
    this.handleNewGapChange = this.handleNewGapChange.bind(this);
    this.addNewGap = this.addNewGap.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { linesBusesInfo } = this.props;
    if (prevProps.linesBusesInfo !== linesBusesInfo) {
      this.setState({
        linesBusesInfo
      });
    }
  }

  addNewGap(newGap, busID) {
    const { currentSession, selectedSessionID } = this.props;
    newGap = { ...newGap, busID: this.props.busGapInfo.busID };
    const init = { method: 'POST', body: JSON.stringify(newGap) };
    fetch(`/api/admin-lines-buses.php`, init)
      .then(response => response.json())
      .then(gapThatWasAdded => {
        this.setState({ gapThatWasAdded }, this.handleAddNewGapClick);
        if (currentSession === 'All Sessions') {
          this.props.getLinesBusesInfo();
        } else {
          this.props.getLinesBusesInfo({ session_id: selectedSessionID });
        }
      })
      .catch(e => console.error(e));
  }

  deleteBusGap(busGapID) {
    const { currentSession, selectedSessionID } = this.props;
    const body = { busGapID };
    const init = { method: 'DELETE', body: JSON.stringify(body) };
    fetch(`/api/admin-lines-buses.php`, init)
      .then(response => response.json())
      .then(deletedGapID => {
        this.setState({ deletedGapID }, () => {
          if (currentSession === 'All Sessions') {
            this.props.getLinesBusesInfo();
          } else {
            this.props.getLinesBusesInfo({ session_id: selectedSessionID });
          }
        });
      })
      .catch(error => console.error(error));
  }

  handleNewGapChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => ({
      newGap: {
        ...prevState.newGap,
        [name]: value
      }
    }));
  }

  handleAddNewGapClick() {
    this.setState({ addNewGapClicked: !this.state.addNewGapClicked });
  }

  render() {
    const { newGap, addNewGapClicked } = this.state;
    const { busGapInfo } = this.props;
    if (!this.props.showGapsModal) return null;
    if (!busGapInfo.gapInfo) return <div>LOADING...</div>;
    if (busGapInfo.gapInfo.length === 0) return <td>There are no gaps for this bus. Please add a gap.</td>;
    return (
      <div className="container gapsModal">
        <div className="row">
          <table className="card-table table gapsModalTable">
            <thead>
              <tr className="gapModalTableHeader">
                <th scope="col">Bus Number</th>
                <th scope="col">Gap</th>
                <th scope="col">Gap Duration</th>
                <th scope="col">Operations</th>
                <th scope="col">
                  <div className="d-flex justify-content-end">
                    <button onClick={this.props.handleGapsModal} className="closeGapModal btn btn-danger">X</button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {busGapInfo.gapInfo.map((busGap, index) => {
                if (index > 0) {
                  return (
                    <tr key={busGap.busGapID + index} className="busGapInfo">
                      <td>{busGap.gapStartTime}</td>
                      <td>{`${busGap.gapDuration}min`}</td>
                      <td>
                        {/* <button onClick={this.handleEditBusClicked} className="busGapEditIconBtn btn btn-warning"><FontAwesomeIcon icon={faEdit} /></button> */}
                        <button onClick={() => this.deleteBusGap(busGap.busGapID)} className="busGapDeleteIconBtn btn btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={busGap.busGapID + index} className="busGapInfo">
                    <td rowSpan="6">
                      <RouteBusDisplay bus={busGapInfo.busNumber} />
                    </td>
                    <td>{busGap.gapStartTime}</td>
                    <td>{`${busGap.gapDuration}min`}</td>
                    <td>
                      {/* <button onClick={this.handleEditBusClicked} className="busGapEditIconBtn btn btn-warning"><FontAwesomeIcon icon={faEdit} /></button> */}
                      <button onClick={() => this.deleteBusGap(busGap.busGapID)} className="busGapDeleteIconBtn btn btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
                    </td>
                    <td></td>
                  </tr>
                );
              }
              )}
            </tbody>
          </table>
        </div>
        {addNewGapClicked
          ? <div className="row">
            <table className="card-table table gapsModalTable">
              <thead>
                <tr className="gapModalTableHeader">
                  <th scope="col">Bus Number</th>
                  <th scope="col">Gap Start Time</th>
                  <th scope="col">Gap Duration</th>
                  <th scope="col">Operations</th>
                  <th scope="col">
                    {/* <div className="d-flex justify-content-end">
                      <button onClick={this.handleAddNewGapClick} className="closeGapModal btn btn-danger">X</button>
                    </div> */}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan="3">
                    <RouteBusDisplay bus={busGapInfo.busNumber} />
                  </td>
                  <td>
                    <input className="col border border-primary" onChange={this.handleNewGapChange} name="gapStartTime" type="text"/>
                  </td>
                  <td>
                    <input className="col border border-primary" onChange={this.handleNewGapChange} name="gapDuration" type="text"/>
                  </td>
                  <td>
                    <button onClick={() => this.addNewGap(newGap, busGapInfo.busID)} className="closeAddGapTable btn btn-success">ADD GAP</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          : null
        }
        <div className="row">
          <div className="col offset-10 d-flex justify-items-end">
            {addNewGapClicked
              ? <button onClick={this.handleAddNewGapClick} className="addGapCancelBtn col btn btn-warning">CANCEL</button>
              : <button onClick={this.handleAddNewGapClick} className="addGapBtn col btn btn-primary">ADD GAP</button>}
          </div>
        </div>
      </div>
    );
  }
}
