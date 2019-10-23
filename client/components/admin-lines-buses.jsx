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
import { faCircle, faCaretUp, faBus, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Lines from './admin-lines-buses-lines';
import { runInThisContext } from 'vm';

class AdminRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: null,
      linesBusesInfo: [],
      // busInfo: [],
      addLineClicked: false,
      line_name: '',
      lineExists: false
    }
    // this.addNewBus = this.addNewBus.bind(this);
    this.handleAddBusButton = this.handleAddBusButton.bind(this);
    this.getLinesBusesInfo = this.getLinesBusesInfo.bind(this);
    this.handleAddLineButton = this.handleAddLineButton.bind(this);
    this.handleAddLineChange = this.handleAddLineChange.bind(this);
    this.checkIfLineExists = this.checkIfLineExists.bind(this);
  }

  componentDidMount() {
    this.getLinesBusesInfo();
  }

  handleAddBusButton() {
    this.setState({
      addBusClicked: !this.state.addBusClicked
    })
  }

  handleAddLineButton() {
    this.setState({
      addLineClicked: !this.state.addLineClicked
    })
  }

  handleAddLineChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
    this.checkIfLineExists(value);
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

                    <div>
                      {this.state.lineExists ? <label>Line Name - <span className="addNewLineNameExists"><i>Line {`${this.state.line_name}`} Already Exists</i></span></label> : <label>Line Name - <span className="addNewLineName"><i>Name Available</i></span></label>}
                      <input defaultValue={this.state.line_name}
                             className="col border border-primary"
                             type="text"
                             name="line_name"
                             onChange={this.handleAddLineChange}>
                      </input>
                    </div>
                    <div>
                      <label>Active</label>
                      <input className="col border border-primary" type="text" name="active"></input>
                    </div>
                    <div>
                      <label>Public</label>
                      <input className="col border border-primary" type="text" name="public"></input>
                    </div>
                    <div>
                      <label>Regular Service</label>
                      <input className="col border border-primary" type="text" name="regular_service"></input>
                    </div>
                    {this.state.lineExists ? <button className="btn btn-danger" type="submit" name="submit">NOPE</button> : <button className="btn btn-success" type="submit" name="submit">ADD</button>}
                  </div>
                </form>

              </div>
            </div>


            <div className="accordion" id="accordionExample">
              {this.state.linesBusesInfo.map((line, index) =>
                <Lines key={line.line_name + index} getLinesBusesInfo={this.getLinesBusesInfo} accordionID={line.real_route_id + index} addBusClickedToFalse={this.setAddBusClickedToFalse} line={line} handleAddBusButton={this.handleAddBusButton} addBusClicked={this.state.addBusClicked} addBus={this.addBus} />
              )}
              {/* {this.readRouteBusComponent(this.state.routeInfo)} */}


            </div>

          </React.Fragment>
        );

      }
      if (this.state.linesBusesInfo.includes(this.state.line_name)) {

      }

    return (
      <React.Fragment>
      <TopMenuGeneral title="ADMIN - Routes/Buses" />
        {/* <TopMenuShift title="ADMIN - Routes/Buses" page='admin-routes' date="Fall Session"></TopMenuShift> */}
      <div className = "container mt-2">
        <div className = "row ">
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
        <div className = "row justify-content-end">
            <div className="btn btn-outline-dark "  onClick={() => this.handleAddLineButton()}> Add Line + </div>
        </div>
      </div>
        <div className="accordion" id="accordionExample">

          {/* {this.readRouteBusComponent(this.state.routeInfo)} */}
          {this.state.linesBusesInfo.map((line, index) =>
            <Lines key={line.line_name + index} getLinesBusesInfo={this.getLinesBusesInfo} lineID={line.real_route_id} accordionID={line.real_route_id + index} line={line} handleAddBusButton={this.handleAddBusButton} addBusClicked={this.state.addBusClicked} addBus={this.addBus} />
          )}

        </div>
      </React.Fragment>
    );
  }
}

export default AdminRoutes;
