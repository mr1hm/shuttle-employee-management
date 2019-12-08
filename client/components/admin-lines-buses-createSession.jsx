import React from 'react';
import MultipleDatePicker from 'react-multiple-datepicker';

export default class CreateSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newSessionAdded: false,
      sessionExists: false,
      sessions: this.props.allSessions,
      newSession: {
        name: '',
        startDateString: null,
        endDateString: null,
        startDate: '01',
        startMonth: '01',
        startYear: '2020',
        endDate: '01',
        endMonth: '01',
        endYear: '2020',
        notes: '',
        holidays: '',
        minHoursReq: 4
      }
    };
    this.handleNewSessionChange = this.handleNewSessionChange.bind(this);
    this.handleNewSessionSubmit = this.handleNewSessionSubmit.bind(this);
    this.getAllUpdatedSessions = this.getAllUpdatedSessions.bind(this);
    this.handleNewSessionHolidays = this.handleNewSessionHolidays.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.allSessions !== this.props.allSessions) this.setState({ sessions: this.props.allSessions });
  }

  handleNewSessionChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'name') {
      let nameExists = this.checkIfSessionNameExists(value);
      if (nameExists) {
        this.setState({
          sessionExists: true
        });
      } else {
        this.setState({
          sessionExists: false
        });
      }
    }
    this.setState(prevState => ({
      newSession: {
        ...prevState.newSession,
        [name]: value
      }
    }));
  }

  handleNewSessionHolidays(dates) {
    console.log(dates);
    let holidays = '';
    let holidaysArr = [];
    dates.forEach(d => {
      let dd = String(d.getDate()).padStart(2, '0');
      let mm = String(d.getMonth() + 1).padStart(2, '0');
      let yyyy = d.getFullYear();
      let dateToday = yyyy + '-' + mm + '-' + dd;
      holidaysArr.push(dateToday);
      console.log(holidaysArr);
    });
    holidaysArr.forEach((date, index) => {
      if (index !== holidaysArr.length - 1) {
        date += ', ';
        holidays += date;
      } else {
        holidays += date;
      }
    });
    this.setState(prevState => ({
      newSession: {
        ...prevState.newSession,
        holidays
      }
    }));
  }

  checkIfSessionNameExists(sessionName) {
    const findName = this.props.allSessions.find(sessionObj => sessionObj.name === sessionName);
    if (findName) {
      return true;
    }
    return false;
  }

  handleNewSessionSubmit(newSession, e) {
    e.preventDefault();
    let startDay = this.state.newSession.startDate;
    let startMonth = this.state.newSession.startMonth;
    let startYear = this.state.newSession.startYear;
    let endDay = this.state.newSession.endDate;
    let endMonth = this.state.newSession.endMonth;
    let endYear = this.state.newSession.endYear;
    let newStartDate = `${startYear}-${startMonth}-${startDay}`;
    let newEndDate = `${endYear}-${endMonth}-${endDay}`;
    newSession = { ...newSession, startDateString: newStartDate, endDateString: newEndDate };
    // if (newSession.startDate.length === 11 && newSession.endDate.length === 11) { - USE THIS IF WE WANT TO GO BACK TO UNIX TIMESTAMPS
    //   let startDateNewFormat = newSession.startDate + ' 00:00:00 GMT';
    //   let convertStartDate = new Date(startDateNewFormat);
    //   let startDateUnix = convertStartDate.valueOf();

    //   let endDateNewFormat = newSession.endDate + ' 23:59:00 GMT';
    //   let convertEndDate = new Date(endDateNewFormat);
    //   let endDateUnix = convertEndDate.valueOf();

    //   newSession = { ...newSession, startDate: startDateUnix, endDate: endDateUnix };
    // }
    const init = {
      method: 'POST',
      body: JSON.stringify(newSession)
    };
    fetch(`api/admin-lines-buses-sessions.php`, init)
      .then(response => response.json())
      .then(sessionInfo => {
        this.setState({
          newSessionAdded: true,
          sessions: this.props.allSessions
        }, this.props.getAllSessions);
        this.props.handleAddNewSessionClick();
      })
      .catch(error => console.error(error));

  }

  getAllUpdatedSessions() {
    fetch('api/admin-lines-buses-sessions.php')
      .then(response => response.json())
      .then(sessions => {
        this.setState({ newSessionAdded: true, sessions });
      })
      .catch(error => console.error(error));
  }

  render() {
    return (
      <div className="row justify-content-center">
        <div className="card mt-1 addSessionLineCard">
          <div className="card-header">
            <div className="row">
              <div className="col-2">
                <label>
                  Session Name
                </label>
                <br />
                <input className="col border border-primary sessionNameInput"
                  type="text"
                  name="name"
                  onChange={this.handleNewSessionChange} />
                <br />
                {this.state.sessionExists ? <span className="sessionNameSpan"><i className="sessionNameExists">Session {`"${this.state.newSession.name}"`} Already Exists</i></span> : <span className="sessionNameSpan"><i className="sessionNameAvailable">Name Available</i></span>}
              </div>
              <div className="col">
                <label>Start Year</label>
                <br />
                <select onChange={this.handleNewSessionChange} className="col border border-primary sessionStartYearInput" name="startYear" type="text">
                  <option>2020</option>
                  <option>2021</option>
                  <option>2022</option>
                  <option>2023</option>
                  <option>2024</option>
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027</option>
                  <option>2028</option>
                  <option>2029</option>
                  <option>2030</option>
                </select>
              </div>
              <div className="col">
                <label>Start Month</label>
                <br />
                <select onChange={this.handleNewSessionChange} className="col border border-primary sessionStartMonthInput" name="startMonth" type="text">
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>
              </div>
              <div className="col">
                <label>Start Day</label>
                <br />
                <select onChange={this.handleNewSessionChange} className="col border border-primary sessionStartDateInput" name="startDate" type="text">
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>13</option>
                  <option>14</option>
                  <option>15</option>
                  <option>16</option>
                  <option>17</option>
                  <option>18</option>
                  <option>19</option>
                  <option>20</option>
                  <option>21</option>
                  <option>22</option>
                  <option>23</option>
                  <option>24</option>
                  <option>25</option>
                  <option>26</option>
                  <option>27</option>
                  <option>28</option>
                  <option>29</option>
                  <option>30</option>
                  <option>31</option>
                </select>
              </div>
              <div className="col">
                <label>End Year</label>
                <br />
                <select onChange={this.handleNewSessionChange} className="col border border-primary sessionEndYearInput" name="endYear" type="text">
                  <option>2020</option>
                  <option>2021</option>
                  <option>2022</option>
                  <option>2023</option>
                  <option>2024</option>
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027</option>
                  <option>2028</option>
                  <option>2029</option>
                  <option>2030</option>
                </select>
              </div>
              <div className="col">
                <label>End Month</label>
                <br />
                <select onChange={this.handleNewSessionChange} className="col border border-primary sessionEndMonthInput" name="endMonth" type="text">
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>
              </div>
              <div className="col">
                <label>End Day</label>
                <br />
                <select onChange={this.handleNewSessionChange} className="col border border-primary sessionEndDateInput" name="endDate" type="text">
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>13</option>
                  <option>14</option>
                  <option>15</option>
                  <option>16</option>
                  <option>17</option>
                  <option>18</option>
                  <option>19</option>
                  <option>20</option>
                  <option>21</option>
                  <option>22</option>
                  <option>23</option>
                  <option>24</option>
                  <option>25</option>
                  <option>26</option>
                  <option>27</option>
                  <option>28</option>
                  <option>29</option>
                  <option>30</option>
                  <option>31</option>
                </select>
              </div>
              <div className="col-2">
                <label>Notes (Optional)</label>
                <br />
                <input onChange={this.handleNewSessionChange} className="col border border-primary sessionNotesInput" type="text" name="notes" />
              </div>
            </div>
            <div className="row">
              {/* <div className="col-2">
                <label>Operator</label>
                <br />
                <input className="col border border-primary sessionOperatorInfoInput" name="" type="text" />
              </div> */}
              <div className="col-2">
                <label>Holiday Dates</label>
                <br />
                <MultipleDatePicker onSubmit={this.handleNewSessionHolidays} />
                {/* <input onChange={this.handleNewSessionChange} name="holidays" className="col border border-primary sessionOperatorInfoInput" type="date" /> */}
              </div>
              {/* <div className="col">
                <label>Required Start Date</label>
                <br />
                <input onChange={this.handleNewSessionChange} name="reqStartDate" className="col border border-primary sessionOperatorInfoInput" type="text" />
              </div>
              <div className="col">
                <label>Required End Date</label>
                <br />
                <input onChange={this.handleNewSessionChange} name="reqEndDate" className="col border border-primary sessionOperatorInfoInput" type="text" />
              </div>
            </div>
            <div className="row">
              <div className="col-12 minHoursRequiredCol">
                <label className="minHoursReqLabel">Minimum Hours Required</label>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <span>Operator</span>
                <input onChange={this.handleNewSessionChange} name="minHoursReqOperator" className="col border border-primary sessionOperatorInfoInput" type="text" />
              </div>
              <div className="col">
                <span>Operations</span>
                <br />
                <input onChange={this.handleNewSessionChange} name="minHoursReqOperations" className="col border border-primary sessionOperatorInfoInput" type="text" />
              </div>
              <div className="col">
                <span>Trainer</span>
                <br />
                <input onChange={this.handleNewSessionChange} name="minHoursReqTrainer" className="col border border-primary sessionOperatorInfoInput" type="text" />
              </div>
              <div className="col">
                <span>Trainee</span>
                <br />
                <input onChange={this.handleNewSessionChange} name="minHoursReqTrainee" className="col border border-primary sessionOperatorInfoInput" type="text" />
              </div> */}
              <div className="col-2">
                {/* <button onClick={this.handleAddLineButton} className="col btn btn-warning">CANCEL</button>
                <br /> */}
                <span></span>
                <br/>
                {this.state.sessionExists ? <button className="col btn btn-danger mt-1" type="submit" name="submit">NAME TAKEN</button> : <button onClick={e => this.handleNewSessionSubmit(this.state.newSession, e)} className="col btn btn-success mt-1" type="submit" name="submit">ADD</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
