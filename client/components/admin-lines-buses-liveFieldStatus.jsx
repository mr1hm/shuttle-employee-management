import React from 'react';
import { getZeroPaddedNumber } from '../lib/time-functions';

export default class LiveFieldStatus extends React.Component {
  constructor(props) {
    super(props);
    this.timeConverted = [];
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
      driverNameAndVehicleID: null,
      driverName: null,
      vehicleID: null
    };
    this.allShifts = [];
    // this.prevShift = {
    //   name: `NOT SCHEDULED`,
    //   startTime: `NA`,
    //   endTime: `NA`,
    //   vehicleID: `NA`,
    //   busNumber: `NA`,
    //   lineName: `NA`
    // };
    // this.currentShift = {
    //   name: `NOT SCHEDULED`,
    //   startTime: `NA`,
    //   endTime: `NA`,
    //   vehicleID: `NA`,
    //   busNumber: `NA`,
    //   lineName: `NA`
    // };
    // this.upcomingShift = {
    //   name: 'NOT SCHEDULED',
    //   startTime: 'NA',
    //   endTime: 'NA',
    //   vehicleID: `NA`,
    //   busNumber: `NA`,
    //   lineName: `NA`
    // };
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
      displayCurrentTime,
      dateToCompare
    });
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
      console.log(`compare dates`, currentDateTotal, compareSessionStartDate, compareSessionEndDate);
      const compareStartDates = parseInt(currentDateTotal) > parseInt(compareSessionStartDate);
      const compareEndDates = parseInt(currentDateTotal) < parseInt(compareSessionEndDate);

      if (compareStartDates && compareEndDates) this.setState({ currentSession: session });
    });
  }

  findCurrentShift(id) {

    const { roundInfoToday } = this.state;
    let hh = getZeroPaddedNumber(new Date().getHours());
    let mm = getZeroPaddedNumber(new Date().getMinutes());
    let time = hh + '' + mm;
    let currentTime = parseInt(time);
    console.log(currentTime);
    const currentBusID = roundInfoToday.filter(round => round.busID === id);
    console.log(currentBusID);
    for (let i = 0; i < currentBusID.length; ++i) {
      let busNumber = [];
      let lineName = [];
      if (currentTime >= currentBusID[i].shifts[0] && currentTime <= currentBusID[i].shifts[1] && currentBusID[i].line_name !== null) {
        busNumber.push(currentBusID[i].bus_number);
        lineName.push(currentBusID[i].line_name);

        let timeArr = currentBusID[i].shifts[0].split('');
        let timeArr2 = currentBusID[i].shifts[1].split('');
        timeArr.splice(-2, 0, ':');
        timeArr2.splice(-2, 0, ':');
        let formattedStartTime = timeArr.join('');
        let formattedEndTime = timeArr2.join('');

        this.allShifts.push(
          {
            prevShift: {
              name: currentBusID[i - 1] ? `${currentBusID[i - 1].first_name} ${currentBusID[i - 1].last_name}` : `NA`,
              startTime: currentBusID[i - 1] ? `${currentBusID[i - 1].shifts[0][0]}${currentBusID[i - 1].shifts[0][1]}:${currentBusID[i - 1].shifts[0][2]}${currentBusID[i - 1].shifts[0][3]}` : `NA`,
              endTime: currentBusID[i - 1] ? `${currentBusID[i - 1].shifts[1][0]}${currentBusID[i - 1].shifts[1][1]}:${currentBusID[i - 1].shifts[1][2]}${currentBusID[i - 1].shifts[1][3]}` : `NA`,
              vehicleID: currentBusID[i - 1] ? currentBusID[i - 1].vehicle_id : `NA`,
              busNumber: currentBusID[i - 1] ? currentBusID[i - 1].bus_number : `NA`,
              lineName: currentBusID[i - 1] ? currentBusID[i - 1].line_name : `NA`,
              busID: currentBusID[i - 1] ? currentBusID[i - 1].busID : `NA`
            },
            currentShift: {
              name: `${currentBusID[i].first_name} ${currentBusID[i].last_name}`,
              startTime: `${formattedStartTime}`,
              endTime: `${formattedEndTime}`,
              vehicleID: currentBusID[i].vehicle_id,
              busNumber: currentBusID[i].bus_number,
              lineName: currentBusID[i].line_name,
              busID: currentBusID[i].busID
            },
            upcomingShift: {
              name: currentBusID[i + 1] ? currentBusID[i + 1].first_name + ' ' + currentBusID[i + 1].last_name : `NA`,
              startTime: currentBusID[i + 1] ? `${currentBusID[i + 1].shifts[0][0]}${currentBusID[i + 1].shifts[0][1]}:${currentBusID[i + 1].shifts[0][2]}${currentBusID[i].shifts[0][3]}` : `NA`,
              endTime: currentBusID[i + 1] ? `${currentBusID[i + 1].shifts[1][0]}${currentBusID[i + 1].shifts[1][1]}:${currentBusID[i + 1].shifts[1][2]}${currentBusID[i].shifts[1][3]}` : `NA`,
              vehicleID: currentBusID[i + 1] ? currentBusID[i + 1].vehicle_id : `NA`,
              busNumber: currentBusID[i + 1] ? currentBusID[i + 1].bus_number : `NA`,
              lineName: currentBusID[i + 1] ? currentBusID[i + 1].line_name : `NA`,
              busID: currentBusID[i + 1] ? currentBusID[i + 1].busID : `NA`
            }
          });
        console.log(this.allShifts);
        break;
      }
    }
  }

  organizeDriversForToday() {
    this.checkBusID();
    const { roundInfoToday, allSessionsInfo, dateToCompare } = this.state;
    let userID = '';
    let driversForToday = [];
    let timeConverted = [];
    let roundID = null;
    for (let i = 0; i < roundInfoToday.length; ++i) {
      let driver = driversForToday.find(driver => driver.userID === userID);
      if (!driver) {
        let driverInfo = { shifts: [], formattedShifts: [] };
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
        driverInfo.roundID = roundInfoToday[i].roundID;
        driverInfo.shifts.push(roundInfoToday[i].shifts);
        driversForToday.push(driverInfo);

        roundInfoToday[i].shifts.forEach(time => {
          if (time.length === 3) {
            let formattedTime = time[0] + time[1] + ':' + time[2] + time[3];
            console.log(formattedTime);
            timeConverted.push(formattedTime);
            userID = roundInfoToday[i].userID;
          } else if (time.length === 4) {
            let formattedTime = time[0] + time[1] + ':' + time[2] + time[3];
            console.log(formattedTime);
            timeConverted.push(formattedTime);
            userID = roundInfoToday[i].userID;
          }
          if (timeConverted.length === 2) {
            driverInfo.formattedShifts.push(timeConverted);
            timeConverted = [];
          }
        });
      } else {
        driver.shifts.push(roundInfoToday[i].shifts);
        for (let z = 0; z < roundInfoToday[i].shifts.length; ++z) {
          let splitTime = roundInfoToday[i].shifts[z].split('');
          splitTime.splice(-2, 0, ':');
          let formattedTime = splitTime.join('');
          timeConverted.push(formattedTime);
        }
        driver.formattedShifts.push(timeConverted);
        timeConverted = [];
        userID = roundInfoToday[i].userID;
      }
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
      console.log(`compare dates`, currentDateTotal, compareSessionStartDate, compareSessionEndDate);

      if (parseInt(currentDateTotal) > parseInt(compareSessionStartDate) && parseInt(currentDateTotal) < parseInt(compareSessionEndDate)) {
        const currentSession = session;
        this.setState({ currentSession });
      }
    });
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

  checkBusID() {
    const { roundInfoToday } = this.state;
    let busID = [];
    let lineName = [];
    roundInfoToday.map((round, index) => {
      if (!busID.find(id => id === round.busID)) {
        busID.push(round.busID);
        this.findCurrentShift(round.busID);
      }
    });
  }

  render() {
    const { allLinesBusesInfo, allSessionsInfo, roundInfoToday, currentSession, driverNameAndVehicleID } = this.state;
    if (!currentSession) return <div>LOADING</div>;
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
                  {this.allShifts.map((shift, index) => {
                    return (
                      <tr key={shift.prevShift.busID + index}>
                        <td className="liveFieldStatusLineName">{shift.prevShift.lineName}</td>
                        <td>{shift.prevShift.busNumber}</td>
                        <td>{shift.currentShift ? `AE-${shift.currentShift.vehicleID}` : `NA`}</td>
                        <td>
                          {`${shift.prevShift.startTime} - ${shift.prevShift.endTime}`}
                          <br />
                          {`${shift.prevShift.name}`}
                        </td>
                        <td>
                          {`${shift.currentShift.startTime} - ${shift.currentShift.endTime}`}
                          <br />
                          {`${shift.currentShift.name}`}
                        </td>
                        <td>
                          {`${shift.upcomingShift.startTime} - ${shift.upcomingShift.endTime}`}
                          <br />
                          {`${shift.upcomingShift.name}`}
                        </td>
                      </tr>
                    );
                  })}
                  {/* {allLinesBusesInfo.map((lineBusData, index) => {
                    let lineName = [];
                    if (currentSession.id == lineBusData.sessionID) {
                      return (
                        <React.Fragment key={lineBusData.line_name + index}>
                          {roundInfoToday.map((round, index) => {
                            console.log('rd', round.date);
                            console.log('date', this.state.dateToCompare);
                            if (!lineName.find(name => round.line_name === name) && (round.date === this.state.dateToCompare)) {
                              lineName.push(round.line_name);
                              return (
                                // this.checkBusID();
                                <tr key={round.roundID + index}>
                                  <td className="liveFieldStatusLineName">{round.line_name}</td>
                                  <td>{round.bus_number}</td>
                                  <td>{this.currentShift ? `AE-${this.currentShift.vehicleID}` : `NA`}</td>
                                  <td>
                                    {`${this.prevShift.startTime} - ${this.prevShift.endTime}`}
                                    <br />
                                    {`${this.prevShift.name}`}
                                  </td>
                                  <td>
                                    {`${this.currentShift.startTime} - ${this.currentShift.endTime}`}
                                    <br />
                                    {`${this.currentShift.name}`}
                                  </td>
                                  <td>
                                    {`${this.upcomingShift.startTime} - ${this.upcomingShift.endTime}`}
                                    <br />
                                    {`${this.upcomingShift.name}`}
                                  </td>
                                </tr>
                              );
                            } else {
                              return null;
                              // if (!lineBusData.activeBuses.length) {
                              //   return (
                              //     <tr key={round.roundID + index}>
                              //       <td className="liveFieldStatusLineName">{lineBusData.line_name}</td>
                              //       <td>No Bus</td>
                              //       <td>N/A</td>
                              //       <td>N/A</td>
                              //       <td>N/A</td>
                              //       <td>N/A</td>
                              //     </tr>
                              //   );
                              // }
                            }
                          })}
                        </React.Fragment>
                      );
                    }
                  })
                  } */}
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
