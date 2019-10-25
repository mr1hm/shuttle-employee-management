import React from 'react';
import TopMenuShift from './topmenu/topmenu-shift';
import TopMenuGeneral from './topmenu/topmenu-general';
import TopMenuHamburger from './topmenu/topmenu-hamburger';
import Nav from './topmenu/range-nav-bar';
import RouteBusDisplay from './route-bus-display';
import BusesTable from './admin-lines-buses-busesTable';
import AddBus from './admin-lines-buses-addBus';
import './linesBusesStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCaretUp, faBus, faCaretDown, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import Lines from './admin-lines-buses-lines';
// import { runInThisContext } from 'vm';

class AdminRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.lineAdded = null;
    this.state = {
      session: null,
      linesBusesInfo: [],
      // busInfo: [],
      addLineClicked: false,
      line_name: '',
      lineExists: false,
      newLine: {
        line_name: null,
        status: null,
        rounds: null,
        roundDuration: null,
        public: null,
        regularService: null
      }
    }
    this.getUpdatedLines = this.getUpdatedLines.bind(this);
    this.getLinesBusesInfo = this.getLinesBusesInfo.bind(this);
    this.handleAddLineButton = this.handleAddLineButton.bind(this);
    this.handleAddLineChange = this.handleAddLineChange.bind(this);
    this.checkIfLineExists = this.checkIfLineExists.bind(this);
    this.scrollToNewLine = this.scrollToNewLine.bind(this);
  }

  componentWillMount() { // runs right before render runs.
    this.getLinesBusesInfo();
  }

  scrollToNewLine() {
    this.ref.current.scrollIntoView({
      behavior: 'auto',
      block: 'start',
    });
  }

  addNewLine(newLine, e) {
    e.preventDefault();
    const init = {
      method: 'POST',
      body: JSON.stringify(newLine)
    };
    fetch(`api/admin-lines-buses.php`, init)
      .then(response => response.json())
      .then(lineInfo => {
        console.log(lineInfo);
        this.getUpdatedLines();
      })
      .catch(error => console.error(error));
      this.handleAddLineButton();
  }

  handleAddLineButton() {
    this.setState({
      addLineClicked: !this.state.addLineClicked
    })
  }

  handleAddLineChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => ({
      newLine: {
        ...prevState.newLine,
        [name]: value
      }
    }));
    this.checkIfLineExists(value);
  }

  getUpdatedLines() {
    fetch('api/admin-lines-buses.php')
      .then(response => response.json())
      .then(linesBusesInfo => this.setState({
        linesBusesInfo: linesBusesInfo
      }, this.scrollToNewLine))
      .catch(error => console.error(error));
  }

  getLinesBusesInfo() {
    fetch('api/admin-lines-buses.php')
      .then(response => response.json())
      .then(linesBusesInfo => this.setState({
        linesBusesInfo: linesBusesInfo
      }))
      .catch(error => console.error(error));
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

  render() {
    const linesInfoLength = this.state.linesBusesInfo.length;
    let linesInfo = this.state.linesBusesInfo;
    let largestID = 0;
    for (let i = 0; i < linesInfoLength; i++) {
      let routeIDNum = parseInt(linesInfo[i].real_route_id);
      if (routeIDNum > largestID) {
        largestID = routeIDNum;
      }
    }
    console.log('largest route id:', largestID);
    if (largestID === 0) {
      return null;
    }
    if (!this.state.linesBusesInfo) {
      return (
        <div>LOADING</div>
      );
    }
    if (this.state.addLineClicked) {
      return (
        <React.Fragment>
          <TopMenuGeneral title="ADMIN - Routes/Buses" />
          {/* <TopMenuShift title="ADMIN - Routes/Buses" page='admin-routes' date="Fall Session"></TopMenuShift> */}
          <div className="container mt-2">
            <div className="row ">
              <form onSubmit={this.handleSubmit}>
                <label >
                  Start Date:
                  <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
                <label>
                  End Date:
                  <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
              </form>
            </div>
            <div className="row justify-content-end">
              {this.state.addLineClicked ? <div className="btn btn-outline-dark " onClick={this.handleAddLineButton}> Add Line - </div> : <div className="btn btn-outline-dark " onClick={() => this.handleAddLineButton()}> Add Line + </div>}
            </div>
          </div>
          <div className="card" >
            <div className="card-header" >

              <form method="POST" action="/api/admin-lines-buses.php">
                <div className="row" >

                  <div className="col">
                    {this.state.lineExists ? <label>Line Name<br /><span className="addNewLineNameExists"><i>Line {`"${this.state.newLine.line_name}"`} Already Exists</i></span></label> : <label>Line Name<br /><span className="addNewLineName"><i>Name Available</i></span></label>}
                    <input defaultValue={this.state.newLineName}
                            className="col border border-primary"
                            type="text"
                            name="line_name"
                            onChange={this.handleAddLineChange}>
                    </input>
                  </div>
                  <div className="col">
                    <label>
                      Status
                      <br />
                      <span className="addLineHeaderDescription"><i>active/inactive</i></span>
                    </label>
                    <input onChange={this.handleAddLineChange} className="col border border-primary" type="text" name="status" />
                  </div>
                  <div className="col">
                    <label>
                      Rounds
                      <br />
                      <span className="addLineHeaderDescription"><i>Number of Rounds</i></span>
                    </label>
                    <input onChange={this.handleAddLineChange} type="text" className="col border border-primary" name="rounds" />
                  </div>
                  <div className="col">
                    <label>
                      Round Duration
                      <br />
                      <span className="addLineHeaderDescription"><i>Number of Minutes</i></span>
                    </label>
                    <input onChange={this.handleAddLineChange} className="col border border-primary" type="text" name="roundDuration" />
                  </div>
                  <div className="col">
                    <label>
                      Public
                      <br />
                      <span className="addLineHeaderDescription"><i>True/False</i></span>
                    </label>
                    <input onChange={this.handleAddLineChange} className="col border border-primary" type="text" name="public" />
                  </div>
                  <div className="col">
                    <label>
                      Regular Service
                      <br />
                      <span className="addLineHeaderDescription"><i>True/False</i></span>
                    </label>
                    <input onChange={this.handleAddLineChange} className="col border border-primary" type="text" name="regularService" />
                  </div>
                  {this.state.lineExists ? <button className="btn btn-danger" type="submit" name="submit">NOPE</button> : <button onClick={(e) => this.addNewLine(this.state.newLine, e)} className="btn btn-success" type="submit" name="submit">ADD</button>}
                </div>
              </form>
            </div>
          </div>
          <div className="accordion" id="accordionExample">
            {this.state.linesBusesInfo.map((line, index) => {
              if (largestID == line.real_route_id) {
                return (
                  <div className="newLine" key={line.real_route_id} ref={this.ref}>
                    <Lines linesBusesInfo={this.state.linesBusesInfo} key={line.real_route_id} getLinesBusesInfo={this.getLinesBusesInfo} accordionID={line.real_route_id + index} addBusClickedToFalse={this.setAddBusClickedToFalse} line={line} handleAddBusButton={this.handleAddBusButton} addBusClicked={this.state.addBusClicked} addBus={this.addBus} />
                  </div>
                );
              }
              return (
                <div key={line.real_route_id}>
                  <Lines linesBusesInfo={this.state.linesBusesInfo} key={line.real_route_id} getLinesBusesInfo={this.getLinesBusesInfo} accordionID={line.real_route_id + index} addBusClickedToFalse={this.setAddBusClickedToFalse} line={line} handleAddBusButton={this.handleAddBusButton} addBusClicked={this.state.addBusClicked} addBus={this.addBus} />
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
    <TopMenuGeneral title="ADMIN - Routes/Buses" />
      {/* <TopMenuShift title="ADMIN - Routes/Buses" page='admin-routes' date="Fall Session"></TopMenuShift> */}
    <div className="container mt-2">
      <div className="row">
          <form onSubmit={this.handleSubmit}>
            <label >
              Start Date:
      <input  type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
            <label>
              End Date:
      <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
      </div>
      <div className="row justify-content-end">
          <div className="btn btn-outline-dark" onClick={() => this.handleAddLineButton()}> Add Line + </div>
      </div>
    </div>
      <div className="accordion" id="accordionExample">
        {this.state.linesBusesInfo.map((line, index) => {
          if (largestID == line.real_route_id) {
            return (
              <div className="newLine" key={line.real_route_id} ref={this.ref}>
                <Lines linesBusesInfo={this.state.linesBusesInfo} key={line.real_route_id} getLinesBusesInfo={this.getLinesBusesInfo} accordionID={line.real_route_id + index} addBusClickedToFalse={this.setAddBusClickedToFalse} line={line} handleAddBusButton={this.handleAddBusButton} addBusClicked={this.state.addBusClicked} addBus={this.addBus} />
              </div>
            );
          }
          return (
            <div key={line.real_route_id}>
              <Lines linesBusesInfo={this.state.linesBusesInfo} key={line.real_route_id} getLinesBusesInfo={this.getLinesBusesInfo} accordionID={line.real_route_id + index} addBusClickedToFalse={this.setAddBusClickedToFalse} line={line} handleAddBusButton={this.handleAddBusButton} addBusClicked={this.state.addBusClicked} addBus={this.addBus} />
            </div>
          );
        }
      )}
      </div>
    </React.Fragment>
  );
}
}

export default AdminRoutes;
