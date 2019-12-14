import React from 'react';
import { convertMilitaryTime } from '../lib/time-functions';

export default class MasterSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allLinesBusesInfo: [],
      allSessionsInfo: [],
      roundInfoToday: [],
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
      driverName: null,
      allShifts: [],
      dateSelection: [],
      selectedDate: null,
      shiftsOnSelectedDate: null
    };
    this.compareCurrentTimeAndDisplayShifts = this.compareCurrentTimeAndDisplayShifts.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.getDataOnSelectedDate = this.getDataOnSelectedDate.bind(this);
  }

  componentDidMount() {
    this.getAllData();
    this.checkCurrentDay();
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
      const compareStartDates = parseInt(currentDateTotal) > parseInt(compareSessionStartDate);
      const compareEndDates = parseInt(currentDateTotal) < parseInt(compareSessionEndDate);

      if (compareStartDates && compareEndDates) this.setState({ currentSession: session });
    });
  }

  handleDateChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    let reformatValue = value.split('/');

    let month = reformatValue[0];
    // let year = reformatValue[2];
    let day = reformatValue[1];
    reformatValue[0] = reformatValue[2];
    reformatValue[1] = month;
    reformatValue[2] = day;
    reformatValue.splice(1, 0, '-');
    reformatValue.splice(3, 0, '-');
    let formattedDate = reformatValue.join('');
    this.setState({ [name]: formattedDate }, this.getDataOnSelectedDate);
  }

  getDataOnSelectedDate() {
    const { selectedDate } = this.state;
    const body = { masterSchedule: selectedDate };
    const init = { method: 'POST', body: JSON.stringify(body) };

    fetch(`api/admin-lines-buses.php`, init)
      .then(response => response.json())
      .then(shiftsOnSelectedDate => {
        this.setState({
          roundInfoToday: shiftsOnSelectedDate
        }, this.compareCurrentTimeAndDisplayShifts);
      })
      .catch(error => console.error(error));
  }

  compareCurrentTimeAndDisplayShifts() {
    this.getCurrentSession();
    const { roundInfoToday } = this.state;
    const d = new Date();

    // Loop through roundInfoToday
    // For each object in roundInfoToday store the line name, and Vehicle ID
    // loop through the rounds in that object
    // condense each shift by start time, end time, userID
    const shifts = [];
    for (let i = 0; i < roundInfoToday.length; i++) {
      const { line_name, bus_number, vehicle_id, shifts: rounds } = roundInfoToday[i];

      for (let j = 0, h = 0; j < rounds.length; j++) {
        if (j === rounds.length - 1) {
          const { start, userID, name, role } = rounds[h];
          shifts.push({
            line_name,
            bus_number,
            vehicle_id,
            start: convertMilitaryTime(start),
            userID,
            name,
            role,
            end: convertMilitaryTime(rounds[j].end)
          });
        } else if (rounds[j].userID !== rounds[h].userID) {
          const { start, userID, name, role } = rounds[h];
          shifts.push({
            line_name,
            bus_number,
            vehicle_id,
            start: convertMilitaryTime(start),
            userID,
            name,
            role,
            end: convertMilitaryTime(rounds[j - 1].end)
          });
          h = j;
        }
      }
    }
    let localTime = d.toLocaleTimeString();
    this.setState({ allShifts: shifts, currentTime: localTime });
  }

  checkCurrentDay() {
    const d = new Date();
    let currentDayOfTheWeek = d.getDay();
    let dd = String(d.getDate()).padStart(2, '0');
    let mm = String(d.getMonth() + 1).padStart(2, '0');
    let yyyy = d.getFullYear();
    let displayCurrentDate = mm + '/' + dd + '/' + yyyy;
    let dateToCompare = yyyy + '-' + mm + '-' + dd;

    let day = dd;
    for (let i = 0; i < 7; i++) {
      const { dateSelection } = this.state;
      if (i === 0) {
        dateSelection.push(`${mm}/${dd}/${yyyy}`);
      }
      if (day[0] === '0') {
        parseInt(day);
        day++;
        day += '';
        if (day.length < 2) {
          day = '0' + day;
        }
        dateSelection.push(`${mm}/${day}/${yyyy}`);
      } else {
        parseInt(day);
        day++;
        day += '';
        dateSelection.push(`${mm}/${day}/${yyyy}`);
      }
    }

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

  getAllData() {
    const d = new Date();
    let dd = String(d.getDate()).padStart(2, '0');
    let mm = String(d.getMonth() + 1).padStart(2, '0');
    let yyyy = d.getFullYear();
    let dateToday = yyyy + '-' + mm + '-' + dd;

    const body = { masterSchedule: dateToday };
    const init = {
      method: 'POST',
      body: JSON.stringify(body)
    };
    let fetchAllLinesBusesInfo = fetch(`/api/admin-lines-buses.php`);
    let fetchAllSessionsInfo = fetch(`/api/admin-lines-buses-sessions.php`);
    let fetchRoundTableInfo = fetch(`/api/admin-lines-buses.php`, init);

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
        }, this.compareCurrentTimeAndDisplayShifts);
      })
      .catch(error => console.error(error));
  }

  render() {
    const { currentSession, allShifts, dateSelection } = this.state;
    if (!currentSession) {
      return <div>LOADING...</div>;
    }
    return (
      <>
        <div className="container-fluid">
          <header>
            <div className="row liveFieldStatusHeader">
              <div className="col">
                <img className="anteaterMascot" src={require('../../server/public/assets/images/mascot/anteater.png')} alt="anteater mascot" />
                <h3 className="liveFieldStatusHeaderTitle">Anteater<br /> Express</h3>
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
                <span className="masterScheduleCurrentDay">{this.state.currentDayOfTheWeek}</span>
              </div>
              <div className="col-12 d-flex justify-content-center">
                <span className="masterScheduleCurrentDateAndTime">{this.state.currentTime}</span>
              </div>
              <br/>
              <div className="col d-flex justify-content-center">
                <select onChange={this.handleDateChange} className="col-1 d-flex justify-content-center border-primary" name="selectedDate">
                  {dateSelection.map((date, index) => {
                    return (
                      <option key={date + index}>{date}</option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="container liveFieldStatusParentContainer">
            <div className="row">
              <div className="col-2"></div>
              <div className="col d-flex ml-5">
                <h2 className="liveFieldStatusSessionName">{currentSession.name}</h2>
              </div>
              {allShifts.length === 0
                ? <div className="col d-flex align-items-end masterScheduleNoDrivers">THERE ARE NO DRIVERS FOR THIS DAY</div> : null}
              <div className="col d-inline-flex align-items-end justify-content-end masterScheduleStartEndDate">
                <div>
                  <span className="liveFieldStatusStartDateSpan"><i className="liveFieldStatusStartDate">Start Date</i>: {currentSession.startDateString}</span>
                  <span><i className="liveFieldStatusEndDate">End Date</i>: {currentSession.endDateString}</span>
                </div>
              </div>
              <div className="col-2 d-inline-flex align-items-end">

              </div>
            </div>
            <div className="container masterScheduleTableContainer">
              <div className="row">
                <table className="table liveFieldStatusTable">
                  <thead>
                    <tr>
                      <th scope="col">Line</th>
                      <th scope="col">Bus Number</th>
                      <th scope="col">Vehicle</th>
                      <th scope="col">Driver</th>
                      <th scope="col">Full Shift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allShifts.length !== 0
                      ? allShifts.map((driver, index) => {
                        return (
                          <tr key={driver.role + index}>
                            <td className="masterScheduleLineName">{driver.line_name}</td>
                            <td>{driver.bus_number}</td>
                            <td>{`AE-${driver.vehicle_id}`}</td>
                            <td>{driver.name}</td>
                            <td>{`${driver.start} - ${driver.end}`}</td>
                          </tr>
                        );
                      }) : null}
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
