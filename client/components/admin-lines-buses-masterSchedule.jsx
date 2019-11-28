import React from 'react';

export default class MasterSchedule extends React.Component {
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
      dateToCompare: null,
      currentTime: null,
      prevShift: null,
      currentShift: null,
      upcomingShift: null,
      driverName: null
    };
    this.prevShift = {
      name: `NOT SCHEDULED`,
      startTime: `NA`,
      endTime: `NA`,
      vehicleID: `NA`,
      busNumber: `NA`,
      lineName: `NA`
    };
    this.currentShift = {
      name: `NOT SCHEDULED`,
      startTime: `NA`,
      endTime: `NA`,
      vehicleID: `NA`,
      busNumber: `NA`,
      lineName: `NA`
    };
    this.upcomingShift = {
      name: 'NOT SCHEDULED',
      startTime: 'NA',
      endTime: 'NA',
      vehicleID: `NA`,
      busNumber: `NA`,
      lineName: `NA`
    };
    this.organizeDriversForToday = this.organizeDriversForToday.bind(this);
    this.checkAndDisplayShifts = this.checkAndDisplayShifts.bind(this);
  }

  componentDidMount() {
    this.getAllData();
    this.checkCurrentDay();
  }

  findCurrentShift() {
    const { roundInfoToday } = this.state;
    let hh = new Date().getHours();
    let mm = new Date().getMinutes();
    let time = hh + '' + mm;
    let currentTime = parseInt(time);
    console.log(currentTime);
    for (let i = 0; i < roundInfoToday.length; ++i) {
      if (currentTime > roundInfoToday[i].shifts[0] && currentTime < roundInfoToday[i].shifts[1]) {

        let timeArr = roundInfoToday[i].shifts[0].split('');
        let timeArr2 = roundInfoToday[i].shifts[1].split('');
        timeArr.splice(-2, 0, ':');
        timeArr2.splice(-2, 0, ':');
        let formattedStartTime = timeArr.join('');
        let formattedEndTime = timeArr2.join('');

        this.prevShift = {
          name: `${roundInfoToday[i - 1].first_name} ${roundInfoToday[i - 1].last_name}`,
          startTime: `${roundInfoToday[i - 1].shifts[0][0]}${roundInfoToday[i - 1].shifts[0][1]}:${roundInfoToday[i - 1].shifts[0][2]}${roundInfoToday[i - 1].shifts[0][3]}`,
          endTime: `${roundInfoToday[i - 1].shifts[1][0]}${roundInfoToday[i - 1].shifts[1][1]}:${roundInfoToday[i - 1].shifts[1][2]}${roundInfoToday[i - 1].shifts[1][3]}`,
          vehicleID: roundInfoToday[i - 1].vehicle_id,
          busNumber: roundInfoToday[i - 1].bus_number,
          lineName: roundInfoToday[i - 1].line_name
        };
        console.log(this.prevShift);
        this.currentShift = {
          name: `${roundInfoToday[i].first_name} ${roundInfoToday[i].last_name}`,
          startTime: `${formattedStartTime}`,
          endTime: `${formattedEndTime}`,
          vehicleID: roundInfoToday[i].vehicle_id,
          busNumber: roundInfoToday[i - 1].bus_number,
          lineName: roundInfoToday[i - 1].line_name
        };
        console.log(this.currentShift);
        this.upcomingShift = {
          name: roundInfoToday[i + 1].first_name + ' ' + roundInfoToday[i + 1].last_name,
          startTime: `${roundInfoToday[i + 1].shifts[0][0]}${roundInfoToday[i + 1].shifts[0][1]}:${roundInfoToday[i + 1].shifts[0][2]}${roundInfoToday[i].shifts[0][3]}`,
          endTime: `${roundInfoToday[i + 1].shifts[1][0]}${roundInfoToday[i + 1].shifts[1][1]}:${roundInfoToday[i + 1].shifts[1][2]}${roundInfoToday[i].shifts[1][3]}`,
          vehicleID: roundInfoToday[i + 1].vehicle_id,
          busNumber: roundInfoToday[i - 1].bus_number,
          lineName: roundInfoToday[i - 1].line_name
        };
        console.log(this.upcomingShift);
      }
    }
  }

  checkCurrentDay() {
    const d = new Date();
    let currentDayOfTheWeek = d.getDay();
    let dd = String(d.getDate()).padStart(2, '0');
    let mm = String(d.getMonth() + 1).padStart(2, '0');
    let yyyy = d.getFullYear();
    let displayCurrentDate = mm + '/' + dd + '/' + yyyy;
    let dateToCompare = yyyy + '-' + mm + '-' + dd;

    switch (currentDayOfTheWeek) {
      case 0:
        currentDayOfTheWeek = 'Sunday';
        break;
      case 1:
        currentDayOfTheWeek = 'Monday';
        break;
      case 2:
        currentDayOfTheWeek = 'Tuesday';
        break;
      case 3:
        currentDayOfTheWeek = 'Wednesday';
        break;
      case 4:
        currentDayOfTheWeek = 'Thursday';
        break;
      case 5:
        currentDayOfTheWeek = 'Friday';
        break;
      case 6:
        currentDayOfTheWeek = 'Saturday';
        break;
    }
    this.setState({
      currentDayOfTheWeek,
      displayCurrentDate,
      dateToCompare
    });
  }

  organizeDriversForToday() {
    this.findCurrentShift();
    const { roundInfoToday } = this.state;
    const { allSessionsInfo } = this.state;
    const { dateToCompare } = this.state;
    let userID = '';
    let driversForToday = [];
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
        driverInfo.shifts.push(roundInfoToday[i].shifts);
        driversForToday.push(driverInfo);
      }
      if (driver) driver.shifts.push(roundInfoToday[i].shifts);
      userID = roundInfoToday[i].userID;
    }
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
          });
        } else if (parseInt(shift[0]) > current24TimeInt) {
          this.setState({
            upcomingShift: `${shift[0]} - ${shift[1]}`
          });
        } else if (current24TimeInt > parseInt(shift[0]) && current24TimeInt < parseInt(shift[1])) {
          this.setState({
            currentShift: `${shift[0]} - ${shift[1]}`
          });
        }
        this.setState({
          driverName: driver.name
        });
      });
    });
  }

  getAllData() {
    const rounds = { rounds: 1 };
    const init = {
      method: 'POST',
      body: JSON.stringify(rounds)
    };
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
        }, this.organizeDriversForToday);
      })
      .catch(error => console.error(error));
  }

  render() {
    const { allLinesBusesInfo } = this.state;
    const { allSessionsInfo } = this.state;
    const { roundInfoToday } = this.state;
    return (
      <>
        <div className="container-fluid">
          <header>
            <div className="row liveFieldStatusHeader">
              <div className="col">
                <img className="anteaterMascot" src={require('../../server/public/assets/images/mascot/anteater.png')} alt="anteater mascot" />
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
                <h1 className="liveFieldStatusTitle">Master Schedule</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <h5>{this.state.currentDayOfTheWeek}</h5>
              </div>
              <div className="col d-flex justify-content-center">
                <h6>{this.state.displayCurrentDate}</h6>
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
                                          {this.state.prevShift}
                                          <br />
                                          {this.state.driverName}
                                        </td>
                                        <td>
                                          {`${this.currentShift.startTime} - ${this.currentShift.endTime}`}
                                          <br />
                                          {this.currentShift.name}
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
