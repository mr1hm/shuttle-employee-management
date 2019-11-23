import React from 'react';

export default class LiveFieldStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allLinesBusesInfo: [],
      allSessionsInfo: [],
      currentLines: null,
      currentBuses: null,
      currentSession: null,
      currentDayOfTheWeek: null,
      currentDate: null
    };
  }

  componentDidMount() {
    this.getAllLinesBusesInfo();
    this.getAllSessions();
    this.checkCurrentDay();
  }

  checkCurrentDay() {
    const d = new Date();
    let currentDayOfTheWeek = d.getDay();
    let dd = String(d.getDate()).padStart(2, '0');
    let mm = String(d.getMonth()).padStart(2, '0');
    let yyyy = d.getFullYear();
    let currentDate = mm + '/' + dd + '/' + yyyy;
    switch (currentDayOfTheWeek) {
      case 0:
        currentDayOfTheWeek = 'Sunday'
        break;
      case 1:
        currentDayOfTheWeek = 'Monday'
        break;
      case 2:
        currentDayOfTheWeek = 'Tuesday'
        break;
      case 3:
        currentDayOfTheWeek = 'Wednesday'
        break;
      case 4:
        currentDayOfTheWeek = 'Thursday'
        break;
      case 5:
        currentDayOfTheWeek = 'Friday'
        break;
      case 6:
        currentDayOfTheWeek = 'Saturday'
        break;
    }
    this.setState({
      currentDayOfTheWeek,
      currentDate
    })
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
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <h5>{this.state.currentDayOfTheWeek}</h5>
          </div>
          <div className="col d-flex justify-content-center">
            <h6>{this.state.currentDate}</h6>
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
            <div className="container liveFieldStatusTableContainer">
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
                    {allLinesBusesInfo.map((lineBusData, index) => {
                      let activeBusesLength = lineBusData.activeBuses.length;
                      let lineName = lineBusData.line_name;
                      if (session.id == lineBusData.sessionID) {
                        return (
                          <React.Fragment key={lineBusData.line_name + index}>
                            {lineBusData.activeBuses.map((bus, index) => {
                              if (bus.daysActive.includes(this.state.currentDayOfTheWeek)) {
                                return (
                                  <tr key={bus.busID + index}>
                                    <td className="liveFieldStatusLineName">{lineName}</td>
                                    <td>{bus.busNumber}</td>
                                    <td>{`AE-${bus.vehicleID}`}</td>
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
                              } else {
                                if (!activeBusesLength) {
                                  return (
                                    <tr key={bus.busID + index}>
                                      <td className="liveFieldStatusLineName">{lineBusData.line_name}</td>
                                      <td>No Bus</td>
                                      <td>N/A</td>
                                      <td>N/A</td>
                                      <td>N/A</td>
                                      <td>N/A</td>
                                    </tr>
                                  );
                                }
                              }
                            })}
                          </React.Fragment>
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
