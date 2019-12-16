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
    fetch(`/api/admin-lines-buses-sessions.php`, init)
      .then(response => response.json())
      .then(sessionInfo => {
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
    let minOperatorHours = null;
    let minOperationsHours = null;
    let minTrainerHours = null;
    let minTraineeHours = null;
    if (this.props.currentSession === 'All Sessions') return <span>Please select a session to see details</span>;
    if (sessionInfo.length === 0) return <span>There are no lines and buses</span>;
    sessionInfo.forEach(line => {
      lineCount++;
      sessionName = line.sessionName;
      sessionStart = line.sessionStart;
      sessionEnd = line.sessionEnd;
      minOperatorHours = line.min_operator_hours;
      minOperationsHours = line.min_operations_hours;
      minTrainerHours = line.min_trainer_hours;
      minTraineeHours = line.min_trainee_hours;
      if (line.sessionNotes) sessionNotes = line.sessionNotes;
      if (line.sessionHolidays) sessionHolidays = line.sessionHolidays;
      if (line.activeBuses.length > 0) {
        for (let i = 0; i < line.activeBuses.length; ++i) {
          busCount++;
        }
      }
    });
    return (
      <>
        <span className="sessionInfoTitle">Current Session: </span><span className="sessionInfoValues">{sessionName}</span>
      <br/>
        <span className="sessionInfoTitle">Session Holidays: </span><span className="sessionInfoValues">{sessionHolidays}</span>
      <br/>
        <span className="sessionInfoTitle">Lines On Session: </span><span className="sessionInfoValues">{lineCount}</span>
      <br/>
        <span className="sessionInfoTitle">Buses Active: </span><span className="sessionInfoValues">{busCount}</span>
      <br/>
        <span className="sessionInfoTitle">Session Start Date: </span><span className="sessionInfoValues">{sessionStart}</span>
      <br/>
        <span className="sessionInfoTitle">Session End Date: </span><span className="sessionInfoValues">{sessionEnd}</span>
      <br/>
        <span className="sessionInfoTitle">Session Notes: </span><span className="sessionInfoValues">{sessionNotes || 'None'}</span>
      <br/>
        <span className="sessionInfoTitle">Session Minimum Hours Required:
          <br />
          <ul>
            <li>Operator: {minOperatorHours}</li>
            <li>Operations: {minOperationsHours}</li>
            <li>Trainer: {minTrainerHours}</li>
            <li>Trainee: {minTraineeHours}</li>
          </ul>
        </span>
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
