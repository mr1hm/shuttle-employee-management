import React from 'react';
import TopMenuShift from './topmenu/topmenu-shift';
import TopMenuGeneral from './topmenu/topmenu-general';
import TopMenuHamburger from './topmenu/topmenu-hamburger';
import Nav from './topmenu/range-nav-bar';
import RouteBusDisplay from './route-bus-display';
import BusesTable from './admin-lines-buses-busesTable';
import AddBus from './admin-lines-buses-addBus';
import Sessions from './admin-lines-buses-sessions';
import GapsModal from './admin-lines-buses-viewGaps';
import Lines from './admin-lines-buses-lines';
import CreateSession from './admin-lines-buses-createSession';
import OperationsHistory from './admin-lines-buses-operationsHistory';
import LiveFieldStatus from './admin-lines-buses-liveFieldStatus';
import MasterSchedule from './admin-lines-buses-master-schedule';
import { Link } from 'react-router-dom';
import './linesBusesStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faPaste } from '@fortawesome/free-solid-svg-icons';

class AdminRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      addNewSessionClicked: false,
      allSessionsView: true,
      copiedSession: null,
      currentSession: 'All Sessions',
      sessions: [],
      sessionSelected: false,
      selectedSessionID: null,
      linesBusesInfo: [],
      addLineClicked: false,
      line_name: '',
      lineExists: false,
      newLine: {
        session_id: 5,
        line_name: null,
        status: 'active',
        roundDuration: null,
        public: 'True',
        regularService: 'True',
        specialDriver: 0
      },
      deleteHistory: [],
      addHistory: [],
      newLineAdded: false,
      mostRecentRouteID: null,
      operationsHistoryMethod: null,
      originalLinesBusesInfo: null,
      liveFieldStatus: false,
      masterFieldStatus: false
    };
    this.getUpdatedLines = this.getUpdatedLines.bind(this);
    this.getLinesBusesInfo = this.getLinesBusesInfo.bind(this);
    this.handleAddLineButton = this.handleAddLineButton.bind(this);
    this.handleAddLineChange = this.handleAddLineChange.bind(this);
    this.checkIfLineExists = this.checkIfLineExists.bind(this);
    this.scrollToNewLine = this.scrollToNewLine.bind(this);
    this.setNewLineAddedToFalse = this.setNewLineAddedToFalse.bind(this);
    this.handleSpecialDriverClick = this.handleSpecialDriverClick.bind(this);
    // this.selectSession = this.selectSession.bind(this);
    this.handleSessionChange = this.handleSessionChange.bind(this);
    this.handlePasteSession = this.handlePasteSession.bind(this);
    this.handleCopySession = this.handleCopySession.bind(this);
    this.handleAddNewSessionClick = this.handleAddNewSessionClick.bind(this);
    this.getAllSessions = this.getAllSessions.bind(this);
    // this.getStoreOperationsHistoryMethod = this.getStoreOperationsHistoryMethod.bind(this);
    this.toggleLiveFieldStatus = this.toggleLiveFieldStatus.bind(this);
    this.toggleMasterFieldStatus = this.toggleMasterFieldStatus.bind(this);
    // this.copyOriginalLinesBusesInfo = this.copyOriginalLinesBusesInfo.bind(this);
    // this.storeOperationsHistory = this.storeOperationsHistory.bind(this);
  }

  componentDidMount() {
    this.getAllSessions();
  }

  handleAddNewSessionClick() {
    this.setState({
      addNewSessionClicked: !this.state.addNewSessionClicked
    });
  }

  getUpdatedSessions(sessionID) {
    const init = {
      method: 'POST',
      body: JSON.stringify(sessionID)
    };
    fetch('api/admin-lines-buses.php', init)
      .then(response => response.json())
      .then(updatedSessionInfo => {
        this.setState({
          linesBusesInfo: updatedSessionInfo
        });
      });
  }

  handleSessionChange(e, sessionID) {
    const value = e.target.value;
    if (value === 'All Sessions') {
      this.setState({
        currentSession: value
      });
      return this.getLinesBusesInfo();
    } else if (value !== 'All Sessions') {
      this.setState({
        currentSession: value
      });
    }
    let sessionInfo = this.state.sessions.find(session => session.name === value);
    this.selectSession({ session_id: sessionInfo.id }, e);
  }

  handleCopySession(sessionID) {
    const init = {
      method: 'POST',
      body: JSON.stringify(sessionID)
    };
    fetch('api/admin-lines-buses.php', init)
      .then(response => response.json())
      .then(sessionLines => {
        console.log(sessionLines);
        this.setState({
          copiedSession: sessionLines
        });
      })
      .catch(error => console.error(error));
  }

  handlePasteSession(e) {
    let copiedSessionArr = this.state.copiedSession.slice();
    console.log(copiedSessionArr);
    copiedSessionArr.forEach(line => {
      line.sessionID = this.state.selectedSessionID;
    });
    console.log(copiedSessionArr);
    const body = { copiedSessionArr, paste: 1 };
    const init = {
      method: 'POST',
      body: JSON.stringify(body)
    };
    fetch('api/admin-lines-buses.php', init)
      .then(response => response.json())
      .then(updatedSessionInfo => {
        this.setState({
          linesBusesInfo: updatedSessionInfo
        }, this.getUpdatedSessions({ session_id: this.state.selectedSessionID }));
      });
  }

  selectSession(sessionID, e) {
    e.preventDefault();
    const init = {
      method: 'POST',
      body: JSON.stringify(sessionID)
    };
    fetch('api/admin-lines-buses.php', init)
      .then(response => response.json())
      .then(sessionData => {
        this.setState({
          linesBusesInfo: sessionData,
          sessionSelected: true,
          selectedSessionID: sessionID.session_id
        });
      })
      .catch(error => console.error(error));
  }

  scrollToNewLine() {
    this.ref.current.scrollIntoView({
      behavior: 'auto',
      block: 'start'
    });
  }

  addNewLine(newLine, e) { // bug in Winter 2020 session. Special Driver is automatically set to true no matter if the box is checked or not when adding a new line.
    e.preventDefault();
    const init = {
      method: 'POST',
      body: JSON.stringify(newLine)
    };
    fetch(`api/admin-lines-buses.php`, init)
      .then(response => response.json())
      .then(lineInfo => {
        this.setState({
          newLineAdded: true
        }, () => {
          this.scrollToNewLine();
          if (this.state.currentSession === 'All Sessions') {
            this.getUpdatedLines();
          } else {
            this.getUpdatedLines({ session_id: newLine.session_id });
          }
        });
      })
      .catch(error => console.error(error));
    this.handleAddLineButton();
    this.setNewLineAddedToFalse();
  }

  setNewLineAddedToFalse() {
    setTimeout(() => {
      this.setState({
        newLineAdded: false
      });
    }, 1000);
  }

  handleAddLineButton() {
    this.setState({
      addLineClicked: !this.state.addLineClicked
    });
  }

  handleAddLineChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    let sessionFind = this.state.sessions.find(session => session.name === this.state.newLine.session_id);
    console.log('session found ', sessionFind);
    this.setState(prevState => ({
      newLine: {
        ...prevState.newLine,
        [name]: value
      }
    }), () => {
      if (this.state.currentSession !== 'All Sessions') {
        this.setState(prevState => ({
          newLine: {
            ...prevState.newLine,
            session_id: this.state.selectedSessionID
          }
        }));
      } else if (sessionFind) {
        this.setState(prevState => ({
          newLine: {
            ...prevState.newLine,
            session_id: sessionFind.id
          }
        }));
      }
    });
    this.checkIfLineExists(value);
    console.log(value);
  }

  handleSpecialDriverClick(e) {
    const checked = e.target.checked;
    if (checked) {
      this.setState(prevState => ({
        newLine: {
          ...prevState.newLine,
          specialDriver: 1
        }
      }));
    } else {
      this.setState(prevState => ({
        newLine: {
          ...prevState.newLine,
          specialDriver: 0
        }
      }));
    }
  }

  getAllSessions() {
    fetch('api/admin-lines-buses-sessions.php')
      .then(response => response.json())
      .then(sessionsData => {
        console.log('getallsessions: ', sessionsData);
        this.setState({
          sessions: sessionsData
        });
        this.getLinesBusesInfo();
      })
      .catch(error => console.error(error));
  }

  getUpdatedLines(sessionID) {
    if (sessionID) {
      const init = {
        method: 'POST',
        body: JSON.stringify(sessionID)
      };
      fetch('api/admin-lines-buses.php', init)
        .then(response => response.json())
        .then(updatedLines => {
          this.setState({
            linesBusesInfo: updatedLines
          }, this.scrollToNewLine);
          if (this.state.currentSession === 'All Sessions') {
            this.getLinesBusesInfo();
          }
        })
        .catch(error => console.error(error));
    } else {
      fetch('api/admin-lines-buses.php')
        .then(response => response.json())
        .then(linesBusesInfo => this.setState({
          linesBusesInfo: linesBusesInfo
        }, this.scrollToNewLine))
        .catch(error => console.error(error));
    }
  }

  getLinesBusesInfo(sessionID, e) {
    if (sessionID) {
      const init = {
        method: 'POST',
        body: JSON.stringify(sessionID)
      };
      fetch('api/admin-lines-buses.php', init)
        .then(response => response.json())
        .then(sessionData => {
          console.log('linebusinfo: ', sessionData);
          this.setState({
            linesBusesInfo: sessionData
          });
        })
        .catch(error => console.error(error));
    } else {
      fetch('api/admin-lines-buses.php')
        .then(response => response.json())
        .then(linesBusesInfo => {
          this.setState({
            linesBusesInfo: linesBusesInfo
          });
        })
        .catch(error => console.error(error));
    }
  }

  changeLineExistsState() {
    this.setState(state => ({
      lineExists: !this.state.lineExists
    }));
  }

  checkIfLineExists(value) {
    let doesExist = false;
    let line = this.state.linesBusesInfo;
    let linesBusesInfoLength = this.state.linesBusesInfo.length;
    for (let i = 0; i < linesBusesInfoLength; i++) {
      if (value === line[i].line_name) {
        doesExist = true;
        break;
      }
    }
    if (doesExist) {
      this.setState({
        lineExists: true
      });
    } else {
      this.setState({
        lineExists: false
      });
    }
  }

  // getStoreOperationsHistoryMethod(callback) {
  //   this.setState({
  //     operationsHistoryMethod: callback
  //   });
  // }

  toggleLiveFieldStatus() {
    this.setState({
      liveFieldStatus: !this.state.liveFieldStatus
    });
  }

  toggleMasterFieldStatus() {
    this.setState({
      masterFieldStatus: !this.state.masterFieldStatus
    });
  }

  render() {
    const { linesBusesInfo } = this.state;
    const { sessions } = this.state;
    const linesInfoLength = this.state.linesBusesInfo.length;
    let linesInfo = this.state.linesBusesInfo;
    let largestID = 0;
    for (let i = 0; i < linesInfoLength; i++) {
      let routeIDNum = parseInt(linesInfo[i].real_route_id);
      if (routeIDNum > largestID) {
        largestID = routeIDNum;
      }
    }
    if (!this.state.linesBusesInfo) {
      return (
        <div>LOADING</div>
      );
    }
    if (this.state.addLineClicked) {
      return (
        <React.Fragment>
          <div className="container-fluid">
            <header>
              <div className="row adminLinesBusesHeader">
                <div className="col">
                  <img className="anteaterMascot" src={require('../../server/public/assets/images/mascot/anteater.png')} alt="anteater mascot" />
                  <h3 className="liveFieldStatusHeaderTitle">Anteater<br /> Express</h3>
                </div>
                <div className="col d-flex justify-content-end align-items-end">
                  <h5>ADMIN</h5>
                </div>
              </div>
            </header>
          </div>
          <div className="container liveFieldStatusContentContainer">
            <div className="row">
              <div className="col d-inline-flex">
                <h1 className="adminLinesBusesTitle">Lines & Buses</h1>
              </div>
            </div>
          </div>
          <div className="container-fluid mt-2">
            <div className="container operationsContainer">
              <h4 className="operationsHeader mt-2">Operations</h4>
              <div className="row">
                <div className="col-4">
                  <label className="selectSessionLabel">Select Session</label>
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
                  {this.state.addNewSessionClicked ? <button onClick={this.handleAddNewSessionClick} className="btn btn-outline-dark newSessionBtn w-100">Cancel</button>
                    : <button onClick={this.handleAddNewSessionClick} className="btn btn-outline-dark newSessionBtn w-100">Add New Session</button>}
                </div>
                <div className="col d-flex align-items-end">
                  <br />
                  {this.state.addLineClicked ? <button className="btn btn-outline-dark w-100 addLineBtn" onClick={() => this.handleAddLineButton()}>Cancel</button>
                    : <button className="btn btn-outline-dark w-100 addLineBtn" onClick={() => this.handleAddLineButton()}>Add New Line</button>}
                </div>
                <div className="col d-flex align-items-end">
                  <br />
                  <Link to={{
                    pathname: `/livefieldstatus`,
                    state: {
                      linesBusesInfo,
                      sessions
                    }
                  }}
                  onClick={this.toggleLiveFieldStatus}
                  className="btn btn-outline-dark w-100 liveFieldStatusBtn">
                    Live Field View
                  </Link>
                </div>
                <div className="col d-flex align-items-end">
                  <Link to={{
                    pathname: `/masterschedule`,
                    state: {
                      linesBusesInfo,
                      sessions
                    }
                  }}
                  onClick={this.toggleMasterFieldStatus}
                  className="btn btn-outline-dark w-100 masterScheduleBtn">
                    Master Schedule
                  </Link>
                </div>
              </div>
              <div className="row">
                {this.state.sessionSelected && this.state.currentSession !== 'All Sessions'
                  ? <div className="col-2 mt-1 mb-1"><button className="btn btn-primary w-100" onClick={() => this.handleCopySession({ session_id: this.state.selectedSessionID })}>Copy Session<FontAwesomeIcon className="ml-1" icon={faCopy} /></button></div> : null}
                {this.state.copiedSession && this.state.currentSession !== 'All Sessions'
                  ? <div className="col-2 mt-1 mb-1"><button className="btn btn-info w-100" onClick={this.handlePasteSession}>Paste Session<FontAwesomeIcon className="ml-1" icon={faPaste} /></button></div> : null}
              </div>
              {this.state.addNewSessionClicked ? <CreateSession handleAddNewSessionClick={this.handleAddNewSessionClick} getAllSessions={this.getAllSessions} allSessions={this.state.sessions} /> : null}
              <div className="row justify-content-center">
                <div className="card mt-1 addLineCard">
                  <div className="card-header">
                    <div className="row">
                      <div className="col-2">
                        <label>Line Name</label>
                        <br />
                        <input defaultValue={this.state.newLineName}
                          className="col border border-primary lineNameInput"
                          type="text"
                          name="line_name"
                          onChange={this.handleAddLineChange}>
                        </input>
                        <br />
                        {this.state.lineExists ? <span className="addNewLineNameExists"><i>Line {`"${this.state.newLine.line_name}"`} Already Exists</i></span> : <span className="addNewLineName"><i>Name Available</i></span>}
                      </div>
                      {this.state.currentSession === 'All Sessions'
                        ? <div className="col">
                          <label>
                            Session
                            <br />
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
                        </label>
                        <input onChange={this.handleAddLineChange} className="col border border-primary roundDurationInput" type="text" name="roundDuration" />
                        <span className="addLineHeaderDescription addLineRoundDurationDescription"><i>Number of Minutes</i></span>
                      </div>
                      <div className="col">
                        <label>
                          Public
                          <br />
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
              <h4 className="operationsHistory mt-2">Operations History</h4>
              <OperationsHistory getLinesBusesInfo={this.getLinesBusesInfo} linesBusesInfo={this.state.linesBusesInfo} />
            </div>
          </div>
          <div className="accordion" id="accordionExample">
            {this.state.linesBusesInfo.map((line, index) => {
              if (this.state.newLineAdded && (largestID == line.real_route_id)) {
                return (
                  <div className="newLine" key={line.real_route_id} ref={this.ref}>
                    <Lines storeOperationsHistory={this.storeOperationsHistory} handleGapsModal={this.handleGapsModal} selectedSessionID={this.state.selectedSessionID} currentSession={this.state.currentSession} addLineClicked={this.state.addLineClicked} getSessionName={this.getSessionName} sessionName={this.state.sessionName} sessions={this.state.sessions} linesBusesInfo={this.state.linesBusesInfo} key={line.real_route_id} getLinesBusesInfo={this.getLinesBusesInfo} accordionID={line.real_route_id + index} addBusClickedToFalse={this.setAddBusClickedToFalse} line={line} handleAddBusButton={this.handleAddBusButton} addBusClicked={this.state.addBusClicked} addBus={this.addBus} />
                  </div>
                );
              }
              return (
                <div key={line.real_route_id}>
                  <Lines storeOperationsHistory={this.storeOperationsHistory} handleGapsModal={this.handleGapsModal} selectedSessionID={this.state.selectedSessionID} currentSession={this.state.currentSession} addLineClicked={this.state.addLineClicked} getSessionName={this.getSessionName} sessionName={this.state.sessionName} sessions={this.state.sessions} linesBusesInfo={this.state.linesBusesInfo} key={line.real_route_id} getLinesBusesInfo={this.getLinesBusesInfo} accordionID={line.real_route_id + index} addBusClickedToFalse={this.setAddBusClickedToFalse} line={line} handleAddBusButton={this.handleAddBusButton} addBusClicked={this.state.addBusClicked} addBus={this.addBus} />
                </div>
              );
            }
            )}
          </div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <div className="container-fluid">
          <header>
            <div className="row adminLinesBusesHeader">
              <div className="col">
                <img className="anteaterMascot" src={require('../../server/public/assets/images/mascot/anteater.png')} alt="anteater mascot" />
                <h3 className="liveFieldStatusHeaderTitle">Anteater<br /> Express</h3>
              </div>
              <div className="col d-flex justify-content-end align-items-end">
                <h5>ADMIN</h5>
              </div>
            </div>
          </header>
        </div>
        <div className="container liveFieldStatusContentContainer">
          <div className="row">
            <div className="col d-inline-flex">
              <h1 className="adminLinesBusesTitle">Lines & Buses</h1>
            </div>
          </div>
        </div>
        <div className="container-fluid mt-2">
          <div className="container operationsContainer">
            <h4 className="operationsHeader mt-2">Operations</h4>
            <div className="row">
              <div className="col-4">
                <label className="selectSessionLabel">Select Session</label>
                <select onChange={this.handleSessionChange} className="col border border-primary" name="sessions">
                  <option>All Sessions</option>
                  {this.state.sessions.map(sessionData => {
                    return (
                      <Sessions key={`session${sessionData.id}`} allSessions={this.state.sessions} sessionData={sessionData} />
                    );
                  })}
                </select>
              </div>
              <div className="col d-flex align-items-end">
                {this.state.addNewSessionClicked ? <button onClick={this.handleAddNewSessionClick} className="btn btn-outline-dark newSessionBtn w-100">Cancel</button>
                  : <button onClick={this.handleAddNewSessionClick} className="btn btn-outline-dark newSessionBtn w-100">Add New Session</button>}
              </div>
              <div className="col d-flex align-items-end">
                <br />
                {this.state.addLineClicked ? <button className="btn btn-outline-dark w-100 addLineBtn" onClick={() => this.handleAddLineButton()}>Cancel</button>
                  : <button className="btn btn-outline-dark w-100 addLineBtn" onClick={() => this.handleAddLineButton()}>Add New Line</button>}
              </div>
              <div className="col d-flex align-items-end">
                <br />
                <Link to={{
                  pathname: `/livefieldstatus`,
                  state: {
                    linesBusesInfo,
                    sessions
                  }
                }}
                onClick={this.toggleLiveFieldStatus}
                className="btn btn-outline-dark w-100 liveFieldStatusBtn">
                  Live Field View
                </Link>
              </div>
              <div className="col d-flex align-items-end">
                <Link to={{
                  pathname: `/masterschedule`,
                  state: {
                    linesBusesInfo,
                    sessions
                  }
                }}
                onClick={this.toggleMasterFieldStatus}
                className="btn btn-outline-dark w-100 masterScheduleBtn">
                  Master Schedule
                </Link>
              </div>
            </div>
            <div className="row">
              {this.state.sessionSelected && this.state.currentSession !== 'All Sessions'
                ? <div className="col-2 mt-1"><button className="btn btn-primary w-100" onClick={() => this.handleCopySession({ session_id: this.state.selectedSessionID })}>Copy Session<FontAwesomeIcon className="ml-1" icon={faCopy} /></button></div> : null}
              {this.state.copiedSession && this.state.currentSession !== 'All Sessions'
                ? <div className="col-2 mt-1"><button className="btn btn-info w-100" onClick={this.handlePasteSession}>Paste Session<FontAwesomeIcon className="ml-1" icon={faPaste} /></button></div> : null}
            </div>
            {this.state.addNewSessionClicked ? <CreateSession handleAddNewSessionClick={this.handleAddNewSessionClick} getAllSessions={this.getAllSessions} allSessions={this.state.sessions} /> : null}
            <h4 className="operationsHistory mt-2">Operations History</h4>
            <OperationsHistory getLinesBusesInfo={this.getLinesBusesInfo} originalLinesBusesInfo={this.state.originalLinesBusesInfo} getStoreOperationsHistoryMethod={this.getStoreOperationsHistoryMethod} linesBusesInfo={this.state.linesBusesInfo} />
          </div>
        </div>
        <div className="accordion" id="accordionExample">
          {this.state.linesBusesInfo.map((line, index) => {
            if (this.state.newLineAdded && (largestID == line.real_route_id)) {
              return (
                <div className="newLine" key={`lineDiv${line.real_route_id}`} ref={this.ref}>
                  <Lines operationsHistoryMethod={this.state.operationsHistoryMethod} storeOperationsHistory={this.storeOperationsHistory} handleGapsModal={this.handleGapsModal} selectedSessionID={this.state.selectedSessionID} currentSession={this.state.currentSession} addLineClicked={this.state.addLineClicked} getSessionName={this.getSessionName} sessionName={this.state.sessionName} sessions={this.state.sessions} linesBusesInfo={this.state.linesBusesInfo} key={line.real_route_id} getLinesBusesInfo={this.getLinesBusesInfo} accordionID={line.real_route_id + index} addBusClickedToFalse={this.setAddBusClickedToFalse} line={line} handleAddBusButton={this.handleAddBusButton} addBusClicked={this.state.addBusClicked} addBus={this.addBus} />
                </div>
              );
            }
            return (
              <div key={`lineDiv${line.real_route_id}`}>
                <Lines operationsHistoryMethod={this.state.operationsHistoryMethod} storeOperationsHistory={this.storeOperationsHistory} handleGapsModal={this.handleGapsModal} selectedSessionID={this.state.selectedSessionID} currentSession={this.state.currentSession} addLineClicked={this.state.addLineClicked} getSessionName={this.getSessionName} sessionName={this.state.sessionName} sessions={this.state.sessions} line={line} linesBusesInfo={this.state.linesBusesInfo} key={line.real_route_id} getLinesBusesInfo={this.getLinesBusesInfo} accordionID={line.real_route_id + index} addBusClickedToFalse={this.setAddBusClickedToFalse} handleAddBusButton={this.handleAddBusButton} addBusClicked={this.state.addBusClicked} addBus={this.addBus} />
              </div>
            );
          }
          )}
        </div>
        <div className="container-fluid">
          <footer>
            <div className="row adminLinesBusesFooter"></div>
          </footer>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminRoutes;
