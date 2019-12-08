import React from 'react';

export default class SessionInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionInfo: null,
      selectedSessionID: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSessionID !== prevProps.selectedSessionID) {
      this.setState({ selectedSessionID: this.props.selectedSessionID }, this.getSessionInfo);
    }
  }

  getSessionInfo() {
    const body = { sessionInfo: this.state.selectedSessionID };
    const init = { method: 'POST', body: JSON.stringify(body) };
    fetch(`api/admin-lines-buses-sessions.php`, init)
      .then(response => response.json())
      .then(sessionInfo => {
        console.log('getSessionInfo: ', sessionInfo);
        this.setState({ sessionInfo });
      })
      .catch(error => console.error(error));
  }

  renderSessionDetails() {
    const { sessionInfo } = this.state;
    let lineCount = 0;
    let busCount = 0;
    let sessionName = null;
    let sessionHolidays = null;
    let sessionNotes = null;
    let sessionStart = null;
    let sessionEnd = null;
    let minHoursReq = null;
    let sessionID = null;
    sessionInfo.forEach(line => {
      lineCount++;
      sessionName = line.sessionName;
      sessionStart = line.sessionStart;
      sessionEnd = line.sessionEnd;
      minHoursReq = line.minHoursReq;
      if (line.sessionNotes.length > 0) sessionNotes = line.sessionNotes;
      if (line.sessionHolidays.length > 0) sessionHolidays = line.sessionHolidays;
      if (line.activeBuses.length > 0) {
        for (let i = 0; i < line.activeBuses.length; ++i) {
          busCount++;
        }
      }
    });
    return (
      <>
      <span>Current Session: {sessionName}</span>
      <br/>
      <span>Session Holidays: {sessionHolidays}</span>
      <br/>
      <span>Lines Active: {lineCount}</span>
      <br/>
      <span>Buses Active: {busCount}</span>
      <br/>
      <span>Session Start Date: {sessionStart}</span>
      <br/>
      <span>Session End Date: {sessionEnd}</span>
      <br/>
      <span>Session Notes: {sessionNotes || 'None'}</span>
      <br/>
      <span>Session Minimum Hours Required: {minHoursReq}</span>
      </>
    );
  }

  render() {
    const { sessionInfo } = this.state;
    if (!sessionInfo) return <div>Please select a session to see details</div>;
    return (
      <div className="row">
        <div className="col">
          {this.renderSessionDetails()}
        </div>
      </div>
    );
  }
}
