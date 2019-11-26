import React from 'react';
// import { start } from 'repl';

export default class LiveFieldStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allLinesBusesInfo: [],
      allSessionsInfo: [],
      roundInfoToday: [],
      driversForToday: [],
      currentLines: null,
      currentBuses: null,
      currentSession: null,
      currentDayOfTheWeek: null,
      displayCurrentDate: null,
      displayCurrentTime: null,
      dateToCompare: null,
      currentTime: null,
      prevShift: null,
      currentShift: null,
      upcomingShift: null,
      driverNameAndVehicleID: null
    };
    this.organizeDriversForToday = this.organizeDriversForToday.bind(this);
    this.checkAndDisplayShifts = this.checkAndDisplayShifts.bind(this);
  }

  componentDidMount() {
    this.getAllData();
    this.checkCurrentDay();
  }

  checkCurrentDay() {
    const d = new Date();
    const displayCurrentTime = d.toLocaleTimeString();
    let currentDayOfTheWeek = d.getDay();
    let dd = String(d.getDate()).padStart(2, '0');
    let mm = String(d.getMonth() + 1).padStart(2, '0');
    let yyyy = d.getFullYear();
    let displayCurrentDate = mm + '/' + dd + '/' + yyyy;
    let dateToCompare = yyyy + '-' + mm + '-' + dd;

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
      displayCurrentDate,
      displayCurrentTime,
      dateToCompare
    })
  }

  getCurrentSession() {
    allSessionsInfo.forEach(session => {
      let yearToCompare = dateToCompare.slice(0, 4);
      let monthToCompare = dateToCompare.slice(5, 7);
      let dayToCompare = dateToCompare.slice(8, 10);
      const currentDateTotal = yearToCompare + monthToCompare + dayToCompare;
      const splitSessionStartDate = session.startDateString.split('-');
      const compareSessionStartDate = splitSessionStartDate.join('');
      const splitSessionEndDate = session.endDateString.split('-');
      const compareSessionEndDate = splitSessionEndDate.join('');
      console.log(`compare dates`, currentDateTotal, compareSessionStartDate, compareSessionEndDate)
      const compareStartDates = parseInt(currentDateTotal) > parseInt(compareSessionStartDate) ? true : false;
      const compareEndDates = parseInt(currentDateTotal) < parseInt(compareSessionEndDate) ? true : false;

      if (compareStartDates && compareEndDates) this.setState({ currentSession: session });
    })
  }

  organizeDriversForToday() {
    const { roundInfoToday, allSessionsInfo, dateToCompare } = this.state;
    let userID = '';
    let driversForToday = [];
    let timeConverted = [];
    for (let i = 0; i < roundInfoToday.length; ++i) {
      let driver = driversForToday.find(driver => driver.userID === userID);
      if (driver === undefined) {
        let driverInfo = { shifts: [] };
        if (!roundInfoToday[i].nickname) {
          driverInfo.name = roundInfoToday[i].first_name + ' ' + roundInfoToday[i].last_name;
        } else {
          driverInfo.name = roundInfoToday[i].first_name + ` ${roundInfoToday[i].nickname} ` + roundInfoToday[i].last_name;
        }
        driverInfo.userID = roundInfoToday[i].userID;
        driverInfo.busID = roundInfoToday[i].busID;
        driverInfo.specialDriver = roundInfoToday[i].special_route_ok;
        driverInfo.sessionID = roundInfoToday[i].session_id;
        driverInfo.date = roundInfoToday[i].date;
        driverInfo.busNumber = roundInfoToday[i].bus_number;
        driverInfo.vehicleID = roundInfoToday[i].vehicle_id;
        roundInfoToday[i].shifts.forEach(time => {
          let standardTime = null;
          let formattedStandardTime = null;
          if (time.length === 3) {
            standardTime = time.split('');
            standardTime = standardTime.splice(1, 0, ':');
            standardTime = standardTime.join('');
            console.log(standardTime);
            timeConverted.push(standardTime);
          } else {
            standardTime = time.split('');
            standardTime = standardTime.splice(2, 0, ':')
            standardTime = standardTime.join('');
            console.log(standardTime);
            timeConverted.push(standardTime);
          }
        })
        driverInfo.shifts.push(timeConverted);
        driversForToday.push(driverInfo);
      }
      if (driver) driver.shifts.push(roundInfoToday[i].shifts);
      userID = roundInfoToday[i].userID;
    }
    allSessionsInfo.forEach(session => {
      let yearToCompare = dateToCompare.slice(0, 4);
      let monthToCompare = dateToCompare.slice(5, 7);
      let dayToCompare = dateToCompare.slice(8, 10);
      const currentDateTotal = yearToCompare + monthToCompare + dayToCompare;
      const splitSessionStartDate = session.startDateString.split('-');
      const compareSessionStartDate = splitSessionStartDate.join('');
      const splitSessionEndDate = session.endDateString.split('-');
      const compareSessionEndDate = splitSessionEndDate.join('');
      console.log(`compare dates`, currentDateTotal, compareSessionStartDate, compareSessionEndDate)

      if (parseInt(currentDateTotal) > parseInt(compareSessionStartDate) && parseInt(currentDateTotal) < parseInt(compareSessionEndDate)) {
        const currentSession = session;
        this.setState({
          currentSession
        })
      }
    })
    this.setState({
      driversForToday
    }, this.checkAndDisplayShifts);
  }

  checkAndDisplayShifts() {
    const { driversForToday } = this.state;
    const { dateToCompare } = this.state;
    const currentTime = new Date().toLocaleTimeString();
    let currentHour = new Date().getHours() + '';
    let currentMin = new Date().getMinutes() + '';
    if (currentHour.length === 1) {
      currentHour = '0' + currentHour;
    } else if (currentMin.length === 1) {
      currentMin = '0' + currentMin;
    }
    const current24Time = currentHour + '' + currentMin;
    console.log(current24Time);
    driversForToday.forEach(driver => {
      driver.shifts.forEach(shift => {
        const current24TimeInt = parseInt(current24Time);
        if (parseInt(shift[1]) < current24TimeInt) {
          this.setState({
            prevShift: `${shift[0]} - ${shift[1]}`
          })
        } else if (parseInt(shift[0]) > current24TimeInt) {
          this.setState({
            upcomingShift: `${shift[0]} - ${shift[1]}`
          })
        } else if (current24TimeInt > parseInt(shift[0]) && current24TimeInt < parseInt(shift[1])) {
          this.setState({
            currentShift: `${shift[0]} - ${shift[1]}`
          })
        }
        const driverNameAndVehicleID = { driverName: driver.name, vehicleID: driver.vehicleID};
        this.setState({
          driverNameAndVehicleID
        })
      })
    })
  }

  getAllData() {
    const rounds = { rounds: 1 };
    const init = {
      method: 'POST',
      body: JSON.stringify(rounds)
    }
    let fetchAllLinesBusesInfo = fetch(`api/admin-lines-buses.php`);
    let fetchAllSessionsInfo = fetch(`api/admin-lines-buses-sessions.php`);
    let fetchRoundTableInfo = fetch(`api/admin-lines-buses.php`, init);

    Promise.all([fetchAllLinesBusesInfo, fetchAllSessionsInfo, fetchRoundTableInfo])
      .then(data => Promise.all(data.map(response => response.json())))
      .then(allData => {
        let allLinesBusesInfo = allData[0];
        let allSessionsInfo = allData[1];
        let roundInfoToday = allData[2];
        this.setState({
          allLinesBusesInfo,
          allSessionsInfo,
          roundInfoToday
        }, this.organizeDriversForToday)
      })
      .catch(error => console.error(error));
  }

  render() {
    const { allLinesBusesInfo, allSessionsInfo, roundInfoToday, currentSession, driverNameAndVehicleID } = this.state;
    if (!currentSession || !driverNameAndVehicleID) return <div>LOADING</div>;
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
            <span className="liveFieldStatusCurrentDay">{this.state.currentDayOfTheWeek}</span>
          </div>
          <div className="col d-flex justify-content-center">
            <span className="liveFieldStatusCurrentDateAndTime">{this.state.displayCurrentDate} : {this.state.displayCurrentTime}</span>
          </div>
        </div>
      </div>
        <div className="container liveFieldStatusParentContainer">
          <div className="row">
            <div className="col-2"></div>
            <div className="col d-flex ml-5">
              <h2 className="liveFieldStatusSessionName">{currentSession.name}</h2>
            </div>
            <div className="col d-inline-flex align-items-end justify-content-end">
              <div>
                <span className="liveFieldStatusStartDateSpan"><i className="liveFieldStatusStartDate">Start Date</i>: {currentSession.startDateString}</span>
                <span><i className="liveFieldStatusEndDate">End Date</i>: {currentSession.endDateString}</span>
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
                    if (currentSession.id == lineBusData.sessionID) {
                      return (
                        <React.Fragment key={lineBusData.line_name + index}>
                          {lineBusData.activeBuses.map((bus, index) => {
                            if (bus.daysActive.includes(this.state.currentDayOfTheWeek)) {
                              return (
                                <tr key={bus.busID + index}>
                                  <td className="liveFieldStatusLineName">{lineName}</td>
                                  <td>{bus.busNumber}</td>
                                  <td>{`AE-${this.state.driverNameAndVehicleID.vehicleID}`}</td>
                                  <td>
                                    {this.state.prevShift}
                                    <br />
                                    {this.state.driverNameAndVehicleID.driverName}
                                  </td>
                                  <td>
                                    {this.state.currentShift}
                                    <br />
                                    {this.state.driverName}
                                  </td>
                                  <td>
                                    {this.state.upcomingShift}
                                    <br />
                                    {this.state.driverName}
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
