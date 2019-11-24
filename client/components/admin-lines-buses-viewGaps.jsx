import React from 'react';
import RouteBusDisplay from './route-bus-display';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default class GapsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editGapStartTimes: null,
      editGapDurations: null
    };
  }

  editBusGaps(e, busID) {
    const value = e.target.value;

  }

  render() {
    const { busGapInfo } = this.props;
    if (!this.props.showGapsModal) {
      return null;
    }
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
              <tr className="busGapInfo">
                <td className="busNumber" rowSpan="3">
                  <RouteBusDisplay bus={busGapInfo.busNumber}></RouteBusDisplay>
                </td>
                <td>{busGapInfo.gapStartTimes[0]}</td>
                <td>{`${busGapInfo.gapDurations[0]}min`}</td>
                <td>
                  <button onClick={this.handleEditBusClicked} className="busGapEditIconBtn btn btn-warning"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => this.deleteBus(busGapInfo.busID)} className="busGapDeleteIconBtn btn btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
                </td>
                <td></td>
              </tr>
              {busGapInfo.gapStartTimes.map((startTime, index) => {
                if (index === 0) {
                  return null;
                } else {
                  return (
                    <tr key={startTime + index} className="busGapInfo">
                      {/* <td rowSpan="3"></td> */}
                      <td>{startTime}</td>
                      <td>{`${busGapInfo.gapDurations[index]}min`}</td>
                      <td>
                        <button onClick={this.handleEditBusClicked} className="busGapEditIconBtn btn btn-warning"><FontAwesomeIcon icon={faEdit} /></button>
                        <button onClick={() => this.deleteBus(busGapInfo.busID)} className="busGapDeleteIconBtn btn btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
                      </td>
                      <td></td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className="offset-11 col d-flex justify-items-end">
            <button className="saveChangesBtn btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    );
  }
}
