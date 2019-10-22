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

class AdminRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: null,
      linesBusesInfo: [],
      // busInfo: [],
      addBusClicked: false,
      addLineClicked: false,
      edit: {
        lineID: null,
        busID: {}
      }
    }
    // this.addNewBus = this.addNewBus.bind(this);
    this.handleAddBusButton = this.handleAddBusButton.bind(this);
    this.getLinesBusesInfo = this.getLinesBusesInfo.bind(this);
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

  getLinesBusesInfo() {
    fetch('api/admin-lines-buses.php')
      .then(response => response.json())
      .then(linesBusesInfo => this.setState({
        linesBusesInfo: linesBusesInfo
      }))
      .catch(error => console.error(error));
  }

  // getBusId() {

  // }

  // setEditBus(lineID, busID) {

  // }

  // editExistingBus(lineID) {
  //   let lineIndex = this.state.linesBusesInfo.findIndex(value => {
  //     return value.id === lineID;
  //   });
  //   const myInit = {
  //     method: 'PUT',
  //     body: JSON.stringify(lineID),
  //     header: {
  //       'Content-Type': 'application/json'
  //     }
  //   };
  //   fetch('/api/admin-lines-buses.php', myInit)
  //     .then(response => response.json())
  //     .then(busToEdit => )
  // }

//   addNewBus(newBus) {
//    // fetch with post method, add new bus to database and line.
//    const myInit = {
//     method: 'POST',
//     body: JSON.stringify(newBus),
//     header: {
//       'Content-Type': 'application/json'
//     }
//    };
//    fetch('/api/admin-lines-buses.php', myInit)
//     .then(response => response.json())
//     .then(busToBeAdded => {
//       let newBusInfo = this.state.busInfo.slice();
//       newBusInfo.push(busToBeAdded);
//       this.setState({
//         busInfo: newBusInfo
//       })
//     })
//     .catch(error => console.error(error));
//  }

  // handleRoutesInformation(url, method) {
  //   fetch(url, { method: method })
  //     .then(response => response.json())
  //     .then(routeInfo => {
  //     this.setState({
  //       routeInfo: routeInfo
  //     });
  //     console.log(routeInfo);
  //   });
  // }

  // handleBusesInformation(url, method) {
  //   fetch(url, { method: method })
  //     .then(response => { return response.json() })
  //     .then(busInfo => {
  //       this.setState({
  //         busInfo: busInfo
  //       })
  //       console.log(busInfo);
  //     })
  // }

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
                <div className="btn btn-outline-dark " onClick={() => this.handleAddLineButton()}> Add Line + </div>
              </div>
            </div>
            <div className="card" >
              <div className="card-header" >

                <form method="POST" action="/api/admin-lines-buses.php">
                  <div className="row" >

                    <div>
                      <label>Line Name</label>
                      <input className="col border border-primary" type="text" name="line_name"></input>
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
                    <button className="btn btn-primary" type="submit" name="submit" >
                      Save
                    </button>

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
