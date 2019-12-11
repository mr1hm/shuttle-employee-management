import React from 'react';
import { getZeroPaddedNumber, convertMilitaryTime } from '../lib/time-functions';

export default class LiveFieldStatus extends React.Component {
  constructor(props) {
    super(props);
    this.timeConverted = [];
    this.state = {
      allLinesBusesInfo: [],
      allSessionsInfo: [],
      roundInfoToday: [],
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
      vehicleID: null,
      allShifts: []
    };
    this.getAllData = this.getAllData.bind(this);
    this.findCurrentShift = this.findCurrentShift.bind(this);
    this.getCurrentSession = this.getCurrentSession.bind(this);
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
    const { allSessionsInfo } = this.state;
    const { dateToCompare } = this.state;
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

      if (compareStartDates && compareEndDates) this.setState({ currentSession: session }, this.findCurrentShift);
    });
  }

  findCurrentShift(id) {

    const { roundInfoToday } = this.state;
    let hh = getZeroPaddedNumber(new Date().getHours());
    let mm = getZeroPaddedNumber(new Date().getMinutes());
    let time = hh + '' + mm;
    let currentTime = parseInt(time);
    const allShifts = [];
    for (let i = 0; i < roundInfoToday.length; ++i) {
      for (let z = 0; z < roundInfoToday[i].shifts.length; ++z) {
        const driver = roundInfoToday[i];
        const startTime = parseInt(roundInfoToday[i].shifts[z].start);
        const endTime = parseInt(roundInfoToday[i].shifts[z].end);
        const compareStartTime = currentTime >= startTime;
        const compareEndTime = currentTime <= endTime;
        if (compareStartTime && compareEndTime) {
          allShifts.push(
            {
              currentShift: {
                name: driver.shifts[z].name,
                startTime: convertMilitaryTime(driver.shifts[z].start),
                endTime: convertMilitaryTime(driver.shifts[z].end),
                vehicleID: driver.vehicle_id,
                busNumber: driver.bus_number,
                lineName: driver.line_name,
                busID: driver.busID,
                role: driver.shifts[z].role
              },
              prevShift: {
                name: z !== 0 ? driver.shifts[z].name : `NA`,
                startTime: z !== 0 ? convertMilitaryTime(driver.shifts[z - 1].start) : `NA`,
                endTime: z !== 0 ? convertMilitaryTime(driver.shifts[z - 1].end) : `NA`,
                vehicleID: z !== 0 ? driver.vehicle_id : `NA`,
                busNumber: z !== 0 ? driver.bus_number : `NA`,
                lineName: z !== 0 ? driver.line_name : `NA`,
                busID: z !== 0 ? driver.busID : `NA`,
                role: z !== 0 ? driver.shifts[z].role : `NA`
              },
              upcomingShift: {
                name: z !== roundInfoToday[i].shifts.length - 1 ? driver.shifts[z + 1].name : `NA`,
                startTime: z !== roundInfoToday[i].shifts.length - 1 ? convertMilitaryTime(driver.shifts[z + 1].start) : `NA`,
                endTime: z !== roundInfoToday[i].shifts.length - 1 ? convertMilitaryTime(driver.shifts[z + 1].end) : `NA`,
                vehicleID: z !== roundInfoToday[i].shifts.length - 1 ? driver.vehicle_id : `NA`,
                busNumber: z !== roundInfoToday[i].shifts.length - 1 ? driver.busNumber : `NA`,
                lineName: z !== roundInfoToday[i].shifts.length - 1 ? driver.lineName : `NA`,
                busID: z !== roundInfoToday[i].shifts.length - 1 ? driver.busID : `NA`,
                role: z !== roundInfoToday[i].shifts.length - 1 ? driver.shifts[z].role : `NA`
              }
            }
          );
          break;
        } // ADD ELSE STATEMENT TO ADD CONDITION IF YOU WANT TO SHOW THAT THERE ARE NO CURRENT SHIFTS.
      }
    }
    this.setState({ allShifts });
  }

  getAllData() {
    const d = new Date();
    let dd = String(d.getDate()).padStart(2, '0');
    let mm = String(d.getMonth() + 1).padStart(2, '0');
    let yyyy = d.getFullYear();
    let dateToCompare = yyyy + '-' + mm + '-' + dd;
    const date = { date: dateToCompare };
    const init = {
      method: 'POST',
      body: JSON.stringify(date)
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
        }, this.getCurrentSession);
      })
      .catch(error => console.error(error));
  }

  render() {
    const { currentSession, allShifts } = this.state;
    if (!currentSession) return <div>LOADING</div>;
    console.log('current session:', currentSession);
    console.log('all shifts:', allShifts);
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
                  {allShifts.map((shift, index) => {
                    console.log(shift);
                    return (
                      <tr key={shift.prevShift.busID + index}>
                        <td className="liveFieldStatusLineName">{shift.currentShift.lineName}</td>
                        <td>{shift.currentShift.busNumber}</td>
                        <td>{shift.currentShift ? `AE-${shift.currentShift.vehicleID}` : `NA`}</td>
                        <td>
                          {`${shift.prevShift.startTime} - ${shift.prevShift.endTime}`}
                          <br />
                          {`${shift.prevShift.name} (${shift.prevShift.role})`}
                        </td>
                        <td>
                          {`${shift.currentShift.startTime} - ${shift.currentShift.endTime}`}
                          <br />
                          {`${shift.currentShift.name} (${shift.currentShift.role})`}
                        </td>
                        <td>
                          {`${shift.upcomingShift.startTime} - ${shift.upcomingShift.endTime}`}
                          <br />
                          {`${shift.upcomingShift.name} (${shift.upcomingShift.role})`}
                        </td>
                      </tr>
                    );
                  })}
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
