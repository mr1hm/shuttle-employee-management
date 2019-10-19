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
import AdminRoutes from './admin-lines-buses';


export default class Lines extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      busDetailsClicked: false,
      addBusClicked: false
    }
    this.displayBusDetails = this.displayBusDetails.bind(this);
    this.handleAddBusButtonClick = this.handleAddBusButtonClick.bind(this);
  }

  handleAddBusButtonClick() {
    this.setState({
      addBusClicked: !this.state.addBusClicked
    })
  }

  displayBusDetails() {
    this.setState({ busDetailsClicked: !this.state.busDetailsClicked });
  }

  render() {
    const { line } = this.props;
    const { activeBuses } = this.props.line;
    console.log(line);
      return (
        <div id="accordion">
          <div className="card" key={line.line_name + activeBuses.busNumber}>
            <div className="card-header lineCardHeader" id={"heading" + line.line_name}>
              <div className="row lineHeaderFirstRow">
                <div className="col-2 lineHeader">Line</div>
                <div className="col">Status</div>
                <div className="col">24 Rds</div>
                <div className="col">Public</div>
                <div className="col">Regular Service</div>
                <div className="col">
                  {activeBuses.length === 0 ? <FontAwesomeIcon className="busInactiveIcon" icon={faBus} /> : <FontAwesomeIcon className="busActiveIcon" icon={faBus} />}
                </div>
              </div>
              <div className="row align-items-center">
                <div className="col-2 ">
                  <RouteBusDisplay route={line.line_name} />
                </div>
                <div className="col">
                  {line.status === 'active' ? <FontAwesomeIcon className="activeIcon" icon={faCircle} /> : <FontAwesomeIcon className="inactiveIcon" icon={faCircle} />}
                  {line.status}
                </div>
                <div className="col">45min</div>
                <div className="col">{line.public}</div>
                <div className="col">{line.regularService}</div>
                <div className="col">
                  <button className="btn btn-link" type="button" data-toggle="collapse"
                    name={`busDetailsClicked${line.route_id}`} data-target={"#collapse" + line.line_name} onClick={this.displayBusDetails} aria-expanded="true" aria-controls={"collapse" + line.line_name}>
                    Bus Details
                      {this.state.busDetailsClicked ? <FontAwesomeIcon className="busDetailsIcon ml-1" icon={faCaretUp} /> : <FontAwesomeIcon className="busDetailsIcon ml-1" icon={faCaretDown} />}
                  </button>
                </div>
              </div>
            </div>

            <div id={"collapse" + line.line_name} className="collapse" aria-labelledby={"heading" + line.line_name}
              data-parent="#accordion">

              <div className="row">
                <div className="col">
                  <div id="accordion">
                    <AddBus accordionID={this.props.accordionID} handleAddBusButton={this.handleAddBusButtonClick}  addBusClicked={this.state.addBusClicked} addBus={this.props.addBus} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="card col-12">
                  <div className="card-header">
                    Active Buses
                        {/* making table main header clickable to collapse accordion */}
                  </div>
                  <table className="card-table table">
                    <thead>
                      <tr>
                        <th scope="col">Bus Number</th>
                        <th scope="col">Start Time</th>
                        <th scope="col">End Time</th>
                        {/* <th scope="col">Rounds</th> */}
                        <th scope="col">Days</th>
                        <th scope="col">Gap</th>
                        <th scope="col">Edit</th>
                      </tr>
                    </thead>
                    {activeBuses.map((bus, index) =>
                      <BusesTable key={bus.busNumber + index} line={line} busInfo={bus} />
                      )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // return (
    //   <div key={line.line_name + line.bus_number} id={"collapse" + line.line_name} className="collapse" aria-labelledby={"heading" + line.line_name}
    //     data-parent="#accordionExample">
    //     <div className="row">
    //       <div className="card col-12">
    //         <div id="collapseBusesActive"> {/* setting table to be a part of accordion component */}
    //           <table className="card-table table">
    //             <thead>
    //               <tr>
    //                 <th scope="col">Bus Number</th>
    //                 <th scope="col">Start Time</th>
    //                 <th scope="col">End Time</th>
    //                 {/* <th scope="col">Rounds</th> */}
    //                 <th scope="col">Days</th>
    //                 <th scope="col">Gap</th>
    //                 <th scope="col">Edit</th>
    //               </tr>
    //             </thead>
    //             <BusesTable line={line} />
    //           </table>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );
}
