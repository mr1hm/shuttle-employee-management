import React from 'react';

export default class CreateSession extends React.Component {
  constructor(props) {
    this.state = {
      sessionExists: false,
      newSession: {
        name: '',
        startDate: '',
        endDate: '',
        notes: ''
      }
    };
  }

  handleNewSessionChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => ({
      ...prevState.newSession,
      [name]: value
    }));
  }

  render() {
    return (
      <div className="row">
        <div className="card mt-1">
          <div className="card-header">
            <div className="row">
              <div className="col-2">
                {this.state.sessionExists ? <label>Session Name<br /><span className="addNewLineNameExists"><i>Line {`"${this.state.newLine.line_name}"`} Already Exists</i></span></label> : <label>Line Name<br /><span className="addNewLineName"><i>Name Available</i></span></label>}
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
                {/* <input onChange={this.handleAddLineChange} className="col border border-primary" type="text" name="status" /> */}
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
            </div >
          </div >
    );
  }
}
