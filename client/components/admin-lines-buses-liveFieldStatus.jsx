import React from 'react';

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
          <div key={session.name + index} className="container liveFieldStatusParentContainer">
            <div className="row">
              <div className="col-6 d-flex justify-content-center text-left">
                <h2 className="liveFieldStatusSessionName">{session.name}</h2>
              </div>
              <div className="col-4 d-inline-flex align-items-end justify-content-end text-right">
                <div>
                  <span className="liveFieldStatusStartDateSpan"><i className="liveFieldStatusStartDate">Start Date</i>: {session.startDateString}</span>
                  <span><i className="liveFieldStatusEndDate">End Date</i>: {session.endDateString}</span>
                </div>
              </div>
              <div className="col-2 d-inline-flex align-items-end">

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
                      <th scope="col">Previous Shift</th>
                      <th scope="col">Current Shift</th>
                      <th scope="col">Upcoming Shift</th>
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
                              if (!activeBusesLength) {
                                return (
                                  <tr>
                                    <td className="liveFieldStatusLineName">{lineBusData.line_name}</td>
                                    <td>No Bus</td>
                                    <td>N/A</td>
                                    <td>N/A</td>
                                    <td>N/A</td>
                                    <td>N/A</td>
                                  </tr>
                                );
                              } else {
                                return (
                                  <tr>
                                    <td className="liveFieldStatusLineName">{lineName}</td>
                                    <td>{bus.busNumber}</td>
                                    <td>{bus.vehicleID}</td>
                                    <td>
                                      Shift Time
                                      <br />
                                      Operator Name
                                    </td>
                                    <td>
                                      Shift Time
                                      <br />
                                      Operator Name
                                    </td>
                                    <td>
                                      Shift Time
                                      <br />
                                      Operator Name
                                    </td>
                                  </tr>
                                );
                              }
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
