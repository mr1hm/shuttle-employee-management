import React from 'react';
import LiveFieldStatusTable from './admin-lines-buses-liveFieldStatusTable';

export default class LiveFieldStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linesBusesInfo: [],
      sessions: [],
      currentLines: null,
      currentBuses: null,
      currentSession: null
    };
  }

  componentDidMount() {
    let linesBusesInfo = this.props.location.state.linesBusesInfo.slice();
    let sessions = this.props.location.state.sessions.slice();
    this.setState({
      linesBusesInfo,
      sessions
    })
  }



  render() {
    const { linesBusesInfo } = this.props.location.state;
    const { sessions } = this.props.location.state;
    console.log(linesBusesInfo);
    return (
      <div className="container-fluid">
        <header>
          <div className="row liveFieldStatusHeader">
            <div className="col">
              <img src="../../server/public/assets/images/mascot/anteater.png" alt="anteater mascot"/>
              <h3>Anteater<br /> Express</h3>
            </div>
          </div>
        </header>
      <div className="container liveFieldStatusContentContainer">
        <div className="row">
          <div className="col d-inline-flex">
            <h1 className="liveFieldStatusTitle">Live Field Status</h1>
          </div>
        </div>
      </div>
      {sessions.map((session, index) => {
        return (
          <div className="container">
            <div className="row">
              <div className="col d-flex justify-content-center">
                <h2 className="liveFieldStatusSessionName">{session.name}</h2>
              </div>
            </div>
            <div key={session.name + index} className="container liveFieldStatusTableContainer">
              <div className="row">
                <table className="table liveFieldStatusTable">
                  <thead>
                    <tr>
                      <th scope="col">Line</th>
                      <th scope="col">Bus Number</th>
                      <th scope="col">Vehicle</th>
                      <th scope="col">Current Shift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linesBusesInfo.map(lineBusData => {
                      let activeBusesLength = lineBusData.activeBuses.length;
                      let lineName = lineBusData.line_name;
                      if (session.id == lineBusData.sessionID) {
                        return (
                          <>
                            {lineBusData.activeBuses.map((bus, index) => {
                              return (
                                <tr>
                                  <td>{lineBusData.line_name}</td>
                                  <td>{bus.busNumber}</td>
                                  <td>{bus.vehicleID}</td>
                                  <td>Shift Time & Operator Name</td>
                                </tr>
                              );
                            })}
                          </>
                        );
                      }
                    })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}

      </div>
    );
  }
}

// function BusVehicleID(props) {
//   const { linesBusesInfo } = props.location.state;
//   const { sessions } = props.location.state;
//   return (
//     linesBusesInfo.map()
//   );
// }
