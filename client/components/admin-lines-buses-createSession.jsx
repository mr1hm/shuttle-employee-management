import React from 'react';

export default class CreateSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newSessionAdded: false,
      sessionExists: false,
      sessions: this.props.allSessions,
      newSession: {
        name: '',
        startDate: '',
        endDate: '',
        notes: ''
      }
    };
    this.handleNewSessionChange = this.handleNewSessionChange.bind(this);
    this.handleNewSessionSubmit = this.handleNewSessionSubmit.bind(this);
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

  checkIfSessionNameExists(sessionName) {
    const findName = this.props.allSessions.find(sessionObj => sessionObj.name === sessionName);
    if (findName) {
      return true;
    }
    return false;
  }

  handleNewSessionSubmit(newSession, e) {
    e.preventDefault();
    if (newSession.startDate.length === 11 && newSession.endDate.length === 11) {
      let startDateNewFormat = newSession.startDate + ' 00:00:00 GMT';
      let convertStartDate = new Date(startDateNewFormat);
      let startDateUnix = convertStartDate.valueOf();

      let endDateNewFormat = newSession.endDate + ' 23:59:00 GMT';
      let convertEndDate = new Date(endDateNewFormat);
      let endDateUnix = convertEndDate.valueOf();

      newSession = { ...newSession, startDate: startDateUnix, endDate: endDateUnix };
    }
    const init = {
      method: 'POST',
      body: JSON.stringify(newSession)
    };
    fetch(`api/admin-lines-buses-sessions.php`, init)
      .then(response => response.json())
      .then(sessionInfo => {
        this.setState({
          newSessionAdded: true
        }, this.props.handleAddNewSessionClick());
        this.getAllUpdatedSessions();
      })
      .catch(error => console.error(error));

  }

  getAllUpdatedSessions() {
    fetch('api/admin-lines-buses-sessions.php')
      .then(response => response.json())
      .then(sessionsData => {
        console.log(sessionsData);
      })
      .catch(error => console.error(error));
  }

  render() {
    return (
      <div className="row">
        <div className="card w-100 mt-1">
          <div className="card-header">
            <div className="row">
              <div className="col-4">
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
              <div className="col-2">
                <label>Start Date</label>
                <br />
                <input onChange={this.handleNewSessionChange} className="col border border-primary sessionStartDateInput" name="startDate" type="text" />
                <span>
                  <i className="sessionStartDateFormat">DD MMM YYYY<br />Include spaces (i.e. "12 Aug 2020")</i>
                </span>
              </div>
              <div className="col-2">
                <label>End Date</label>
                <br />
                <input onChange={this.handleNewSessionChange} className="col border border-primary sessionEndDateInput" name="endDate" type="text" />
              </div>
              <div className="col-2">
                <label>Notes (Optional)</label>
                <br />
                <input onChange={this.handleNewSessionChange} className="col border border-primary sessionNotesInput" type="text" name="notes" />
              </div>
              {/* <div className="col"></div> */}
              <div className="col-2">
                <button onClick={this.handleAddLineButton} className="col btn btn-warning">CANCEL</button>
                <br />
                {this.state.sessionExists ? <button className="col btn btn-danger mt-1" type="submit" name="submit">NAME TAKEN</button> : <button onClick={e => this.handleNewSessionSubmit(this.state.newSession, e)} className="col btn btn-success mt-1" type="submit" name="submit">ADD</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
