import React from 'react';

export default class LiveFieldStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allLinesBusesInfo: [],
      allSessionsInfo: [],
      currentLines: null,
      currentBuses: null,
      currentSession: null
    };
  }

  componentDidMount() {
    this.getAllLinesBusesInfo();
    this.getAllSessions();
  }

  getAllLinesBusesInfo() {
    fetch(`api/admin-lines-buses.php`)
      .then(response => response.json())
      .then(allLinesBusesInfo => {
        this.setState({
          allLinesBusesInfo
        })
      })
      .catch(error => console.error(error));
  }

  getAllSessions() {
    fetch(`api/admin-lines-buses-sessions.php`)
      .then(response => response.json())
      .then(allSessionsInfo => {
        this.setState({
          allSessionsInfo
        })
      })
      .catch(error => console.error(error));
  }



  render() {
    const { allLinesBusesInfo } = this.state;
    const { allSessionsInfo } = this.state;
    return (
      <>
      <div className="container-fluid">
        <header>
          <div className="row liveFieldStatusHeader">
            <div className="col">
              <img className="anteaterMascot" src={require("../../server/public/assets/images/mascot/anteater.png")} alt="anteater mascot" />
              <h3 className="liveFieldStatusHeaderTitle">Anteater<br /> Express</h3>
            </div>
            <div className="col d-flex justify-content-end align-items-end">
              <h5>ADMIN</h5>
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
      {allSessionsInfo.map((session, index) => {
        return (
          <div key={session.name + index} className="container liveFieldStatusParentContainer">
            <div className="row">
              <div className="col-2"></div>
              <div className="col d-flex ml-5">
                <h2 className="liveFieldStatusSessionName">{session.name}</h2>
              </div>
              <div className="col d-inline-flex align-items-end justify-content-end">
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
                    {allLinesBusesInfo.map(lineBusData => {
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
      <div className="container-fluid">
        <footer>
          <div className="row liveFieldStatusFooter"></div>
        </footer>
      </div>
      </>
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
