import React from 'react';

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
      driverName: null
    };
    this.allShifts = [];
    this.checkAndDisplayShifts = this.checkAndDisplayShifts.bind(this);
    this.compareCurrentTimeAndDisplayShifts = this.compareCurrentTimeAndDisplayShifts.bind(this);
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
      console.log(`compare dates`, currentDateTotal, compareSessionStartDate, compareSessionEndDate);
      const compareStartDates = parseInt(currentDateTotal) > parseInt(compareSessionStartDate);
      const compareEndDates = parseInt(currentDateTotal) < parseInt(compareSessionEndDate);

      if (compareStartDates && compareEndDates) this.setState({ currentSession: session });
    });
  }

  compareCurrentTimeAndDisplayShifts() {
    this.getCurrentSession();
    const { roundInfoToday } = this.state;
    let d = new Date();
    let hh = new Date().getHours();
    let mm = new Date().getMinutes();
    let time = hh + '' + mm;
    let currentTime = parseInt(time);
    console.log(currentTime);
    for (let i = 0; i < roundInfoToday.length; ++i) {
      const name = `${roundInfoToday[i].first_name} ${roundInfoToday[i].last_name}`;
      const role = roundInfoToday[i].role;
      const startTimeToCompare = roundInfoToday[i].shifts[0].start;
      const endTimeToCompare = roundInfoToday[i].shifts[roundInfoToday[i].shifts.length - 1].end;
      let startTime = roundInfoToday[i].shifts[0].start;
      let endTime = roundInfoToday[i].shifts[roundInfoToday[i].shifts.length - 1].end;
      let startTimeSplit = startTime.split('');
      let endTimeSplit = endTime.split('');
      startTimeSplit.splice(-2, 0, ':');
      endTimeSplit.splice(-2, 0, ':');
      startTime = startTimeSplit.join('');
      endTime = endTimeSplit.join('');
      const lineName = roundInfoToday[i].line_name;
      const busNumber = roundInfoToday[i].bus_number;
      const vehicleID = roundInfoToday[i].vehicle_id;
      if (parseInt(startTimeToCompare) < 1200) {
        startTime = `${startTime} AM`;
      } else {
        startTime = `${startTime} PM`;
      }
      debugger;
      if (parseInt(endTimeToCompare) < 1200) {
        endTime = `${endTime} AM`;
      } else {
        endTime = `${endTime} PM`;
      }
      const driver = { name, role, startTime, endTime, lineName, busNumber, vehicleID };
      this.allShifts.push(driver);
    }
    let localTime = d.toLocaleTimeString();
    this.setState({ currentTime: localTime });
    console.log(this.allShifts);
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
    const d = new Date();
    let dd = String(d.getDate()).padStart(2, '0');
    let mm = String(d.getMonth() + 1).padStart(2, '0');
    let yyyy = d.getFullYear();
    let dateToday = yyyy + '-' + mm + '-' + dd;

    const rounds = { date: dateToday };
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
        }, this.compareCurrentTimeAndDisplayShifts);
      })
      .catch(error => console.error(error));
  }

  render() {
    const { currentSession } = this.state;
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
                <span className="masterScheduleCurrentDay">{this.state.currentDayOfTheWeek}</span>
              </div>
              <div className="col d-flex justify-content-center">
                <span className="masterScheduleCurrentDateAndTime">{this.state.displayCurrentDate} : {this.state.currentTime} </span>
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
                      <th scope="col">Driver</th>
                      <th scope="col">Full Shift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.allShifts.map((driver, index) => {
                      if (!driver.lineName || !driver.busNumber || !driver.vehicleID) {
                        return null;
                      }
                      return (
                        <tr key={driver.role + index}>
                          <td className="masterScheduleLineName">{driver.lineName}</td>
                          <td>{driver.busNumber}</td>
                          <td>{`AE-${driver.vehicleID}`}</td>
                          <td>{driver.name}</td>
                          <td>{`${driver.startTime} - ${driver.endTime}`}</td>
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
