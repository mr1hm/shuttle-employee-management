import React from 'react';
import TopMenuShift from './topmenu/topmenu-shift';
import TopMenuGeneral from './topmenu/topmenu-general';
import TopMenuHamburger from './topmenu/topmenu-hamburger';
import Nav from './topmenu/range-nav-bar';
import RouteBusDisplay from './route-bus-display';
import BusesTable from './admin-lines-buses-tableData';
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
      busInfo: [],
      addBusClicked: false,
      addLineClicked: false
    }
    this.addBus = this.addBus.bind(this);
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

  addBus(newBus) {
   // fetch with post method, add new bus to database and line.
   const myInit = {
    method: 'POST',
    body: JSON.stringify(newBus),
    header: {
      'Content-Type': 'application/json'
    }
   };
   fetch('/api/admin-lines-buses.php', myInit)
    .then(response => response.json())
    .then(busToBeAdded => {
      let newBusInfo = this.state.busInfo.slice();
      newBusInfo.push(busToBeAdded);
      this.setState({
        busInfo: newBusInfo
      })
    })
    .catch(error => console.error(error));
 }

  // readRouteBusComponent(routeInfo){
  //   if (!routeInfo){
  //     return;
  //   }
  //   let prevLine = " "
  //   {/** if the edit routes button is not clicked, we will render this**/}
  //   return(
  //     this.state.routeInfo.map((routeInfo, index) => {
  //       let currentLine = routeInfo.line_name;
  //       if (currentLine !== prevLine) {
  //       prevLine = routeInfo.line_name;
  //       //{/* returns the route/line name and bus # if the route has not been displayed already */ }
  //       return (
  //         <div className="card" key={routeInfo.line_name + routeInfo.bus_number}>
  //           <div className="card-header lineCardHeader" id={"heading" + routeInfo.line_name}>
  //             <div className="row lineHeaderFirstRow">
  //               <div className="col-2 lineHeader">Line</div>
  //               <div className="col">Status</div>
  //               <div className="col">24 Rds</div>
  //               <div className="col">Public</div>
  //               <div className="col">Regular Service</div>
  //               <div className="col">
  //                 {routeInfo.bus_number ? <FontAwesomeIcon className="busActiveIcon" icon={faBus} /> : <FontAwesomeIcon className="busInactiveIcon" icon={faBus} />}
  //               </div>
  //             </div>
  //             <div className="row align-items-center" id={index}>
  //               <div className="col-2 ">
  //                 <RouteBusDisplay route={routeInfo.line_name} />
  //               </div>
  //               <div className="col">
  //                 <FontAwesomeIcon className="onlineIcon" icon={faCircle} />
  //                 {routeInfo.status}
  //               </div>
  //               <div className="col">45min</div>
  //               <div className="col">{routeInfo.public}</div>
  //               <div className="col">{routeInfo.regularService}</div>
  //               <div className="col">
  //                 <button className="btn btn-link collapsed" type="button" data-toggle="collapse"
  //                   name={`busDetailsClicked${routeInfo.route_id}`} data-target={"#collapse" + routeInfo.line_name} onClick={this.handleBusDetailsClick} aria-expanded="false" aria-controls={"collapse" + routeInfo.line_name}>
  //                   Bus Details
  //                   {this.state[`busDetailsClicked${routeInfo.route_id}`] ? <FontAwesomeIcon className="busDetailsIcon ml-1" icon={faCaretUp} /> : <FontAwesomeIcon className="busDetailsIcon ml-1" icon={faCaretDown} />}
  //                 </button>
  //               </div>
  //             </div>
  //           </div>

  //           <div id={"collapse" + routeInfo.line_name} className="collapse" aria-labelledby={"heading" + routeInfo.line_name}
  //             data-parent="#accordion">

  //           <div className="row">
  //             <div className="col">
  //               <div id="accordion">
  //                 <AddBus addBusClicked={this.state.addBusClicked} addBusButton={this.handleAddBusButton} addBus={this.addBus}/>
  //               </div>
  //             </div>
  //             </div>
  //             <div className="row">
  //               <div className="card col-12">
  //                 <div className="card-header">
  //                   Active Buses
  //                     {/* making table main header clickable to collapse accordion */}
  //                 </div>
  //                 <table className="card-table table">
  //                   <thead>
  //                     <tr>
  //                       <th scope="col">Bus Number</th>
  //                       <th scope="col">Start Time</th>
  //                       <th scope="col">End Time</th>
  //                       {/* <th scope="col">Rounds</th> */}
  //                       <th scope="col">Days</th>
  //                       <th scope="col">Gap</th>
  //                       <th scope="col">Edit</th>
  //                     </tr>
  //                   </thead>
  //                   <BusesTable busInfo={this.state.busInfo} routeInfo={routeInfo} />
  //                 </table>
  //               </div>
  //             </div>
  //           </div>
  //             </div>
  //         );
  //       }


  //     {/* returns JUST the bus # if the # is already associated with a route/line name */}
  //     return (
  //       <div key={routeInfo.line_name + routeInfo.bus_number} id={"collapse" + routeInfo.line_name} className="collapse" aria-labelledby={"heading" + routeInfo.line_name}
  //         data-parent="#accordionExample">
  //         <div className="row">
  //           <div className="card col-12">
  //             <div id="collapseBusesActive"> {/* setting table to be a part of accordion component */}
  //               <table className="card-table table">
  //                 <thead>
  //                   <tr>
  //                     <th scope="col">Bus Number</th>
  //                     <th scope="col">Start Time</th>
  //                     <th scope="col">End Time</th>
  //                     {/* <th scope="col">Rounds</th> */}
  //                     <th scope="col">Days</th>
  //                     <th scope="col">Gap</th>
  //                     <th scope="col">Edit</th>
  //                   </tr>
  //                 </thead>
  //                 <BusesTable busInfo={this.state.busInfo} routeInfo={routeInfo} />
  //               </table>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //         );
  //       }
  //     )
  //   );
  // }

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
                <Lines key={line.line_name + index} accordionID={line.real_route_id + index} addBusClickedToFalse={this.setAddBusClickedToFalse} line={line} handleAddBusButton={this.handleAddBusButton} addBusClicked={this.state.addBusClicked} addBus={this.addBus} />
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
            <Lines key={line.line_name + index} accordionID={line.real_route_id + index} line={line} handleAddBusButton={this.handleAddBusButton} addBusClicked={this.state.addBusClicked} addBus={this.addBus} />
          )}

        </div>
      </React.Fragment>
    );
  }
}

export default AdminRoutes;
