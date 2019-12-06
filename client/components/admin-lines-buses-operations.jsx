import React from 'react';

// CURRENTLY NOT BEING USED

export default class Operations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operations: null
    }
  }

  render() {
    return (
      <div className="container operationsContainer">
        <h4 className="operationsHeader mt-2">Operations</h4>
        <div className="row">
          <div className="col-4">
            <label className="selectSessionLabel">Select Session</label>
            {this.state.addNewSessionClicked ? <button onClick={this.handleAddNewSessionClick} className="btn btn-outline-dark offset-2 newSessionBtn w-50">Cancel</button>
              : <button onClick={this.handleAddNewSessionClick} className="btn btn-outline-dark offset-2 newSessionBtn w-50">Add New Session</button>}
            <select onChange={this.handleSessionChange} className="col border border-primary" name="currentSession">
              <option>All Sessions</option>
              {this.state.sessions.map(sessionData => {
                return (
                  <Sessions key={`session${sessionData.id}`} allSessions={this.state.sessions} sessionData={sessionData} />
                );
              })}
            </select>
          </div>
          <div className="col d-flex align-items-end">
            <br />
            <button onClick={} className="btn btn-outline-dark w-100 liveFieldStatusBtn">Live Field View</button>
          </div>
          <div className="col d-flex align-items-end">
            <br />
            <button className="btn btn-outline-dark w-100 masterFieldStatusBtn">Master Field View</button>
          </div>
          <div className="col d-flex align-items-end">
            <br />
            <button className="btn btn-outline-dark w-100 addLineBtn" onClick={() => this.handleAddLineButton()}>Cancel</button>
          </div>
        </div>
        <div className="row">
          {this.state.sessionSelected && this.state.currentSession !== 'All Sessions'
            ? <div className="col-2 mt-1 mb-1"><button className="btn btn-primary w-100" onClick={() => this.handleCopySession({ session_id: this.state.selectedSessionID })}>Copy Session<FontAwesomeIcon className="ml-1" icon={faCopy} /></button></div> : null}
          {this.state.copiedSession && this.state.currentSession !== 'All Sessions'
            ? <div className="col-2 mt-1 mb-1"><button className="btn btn-info w-100" onClick={this.handlePasteSession}>Paste Session<FontAwesomeIcon className="ml-1" icon={faPaste} /></button></div> : null}
        </div>
        <div className="row">
          <div className="card mt-1">
            <div className="card-header">
              <div className="row">
                <div className="col-2">
                  {this.state.lineExists ? <label>Line Name<br /><span className="addNewLineNameExists"><i>Line {`"${this.state.newLine.line_name}"`} Already Exists</i></span></label> : <label>Line Name<br /><span className="addNewLineName"><i>Name Available</i></span></label>}
                  <input defaultValue={this.state.newLineName}
                    className="col border border-primary lineNameInput"
                    type="text"
                    name="line_name"
                    onChange={this.handleAddLineChange}>
                  </input>
                </div>
                {this.state.currentSession === 'All Sessions'
                  ? <div className="col">
                    <label>
                      Session
                            <br />
                      <span className="addLineHeaderDescription"><i>active/inactive</i></span>
                    </label>
                    <select onChange={this.handleAddLineChange} className="col border border-primary" type="text" name="session_id">
                      {this.state.sessions.map(session => {
                        return (
                          <option key={session.id}>{session.name}</option>
                        );
                      })}
                    </select>
                  </div> : null}
                <div className="col">
                  <label>
                    Status
                          <br />
                    <span className="addLineHeaderDescription"><i>active/inactive</i></span>
                  </label>
                  <select name="status" className="col border border-primary" onChange={this.handleAddLineChange}>
                    <option>active</option>
                    <option>inactive</option>
                  </select>
                </div>
                <div className="col">
                  <label>
                    Round Duration
                          <br />
                    <span className="addLineHeaderDescription"><i>Number of Min</i></span>
                  </label>
                  <input onChange={this.handleAddLineChange} className="col border border-primary roundDurationInput" type="text" name="roundDuration" />
                </div>
                <div className="col">
                  <label>
                    Public
                          <br />
                    <span className="addLineHeaderDescription"><i>True/False</i></span>
                  </label>
                  <br />
                  <select onChange={this.handleAddLineChange} className="col border border-primary" name="public">
                    <option>True</option>
                    <option>False</option>
                  </select>
                </div>
                <div className="col">
                  <label>
                    Regular Service
                          <br />
                    <span className="addLineHeaderDescription"><i>True/False</i></span>
                  </label>
                  <br />
                  <select onChange={this.handleAddLineChange} className="col border border-primary" name="public">
                    <option>True</option>
                    <option>False</option>
                  </select>
                </div>
                <div className="col">
                  <label className="form-check-label" htmlFor="specialDriverCheckbox">
                    Special Driver
                          <br />
                    <span><i>True/False</i></span>
                  </label>
                  <br />
                  <input type="checkbox" onChange={this.handleSpecialDriverClick} name="specialDriver" className="specialDriverCheckbox form-check-input" id="specialDriverCheckbox" />
                </div>
                <div className="col">
                  <button onClick={this.handleAddLineButton} className="col btn btn-warning">CANCEL</button>
                  <br />
                  {this.state.lineExists ? <button className="col btn btn-danger mt-1" type="submit" name="submit">NAME TAKEN</button> : <button onClick={e => this.addNewLine(this.state.newLine, e)} className="col btn btn-success mt-1" type="submit" name="submit">ADD</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.addNewSessionClicked ? <CreateSession handleAddNewSessionClick={this.handleAddNewSessionClick} getAllSessions={this.getAllSessions} allSessions={this.state.sessions} /> : null}
        <h4 className="operationsHistory mt-2">Operations History</h4>
        <OperationsHistory getLinesBusesInfo={this.getLinesBusesInfo} linesBusesInfo={this.state.linesBusesInfo} />
      </div>
    );
  }
}
