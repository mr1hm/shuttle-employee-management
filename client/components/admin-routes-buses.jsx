import React from 'react';
import TopMenuShift from './topmenu/topmenu-shift';
import TopMenuGeneral from './topmenu/topmenu-general';
import TopMenuHamburger from './topmenu/topmenu-hamburger';
import Nav from './topmenu/range-nav-bar';
import RouteBusDisplay from './route-bus-display';

// THIS FILE IS NOT BEING USED.


class AdminRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: null,
      routeInfo: [],
      busInfo: []
    }
  }

  createRouteBusComponent(routeInfo){
    if (!routeInfo){
      return;
    }
    let prevLine = " ";
    return(
    routeInfo.map((routeInfo, index) => {

      let currentLine = routeInfo.line_name;
      if (currentLine !== prevLine){
        prevLine = routeInfo.line_name;
        {/* returns the route/line name and bus # if the route has not been displayed already */ }
      return (

        <div className = "card" key = {routeInfo.line_name + routeInfo.bus_number}>
        <div className="card-header" id={"heading" + routeInfo.line_name}>
            <div className="row" id={index}>
              <div className="col">
                <RouteBusDisplay route={routeInfo.line_name}></RouteBusDisplay>
              </div>
              <div className="col">{routeInfo.status}</div>
              <div className="col">true</div>
              <div className="col">true</div>
              {/* <div className="col">{routeInfo.public.toString()}</div> */}
              {/* <div className="col">{routeInfo.regular_service.toString()}</div> */}
              <button className="btn btn-link  collapsed dropdown-toggle" type="button" data-toggle="collapse"
              data-target={"#collapse" + routeInfo.line_name} aria-expanded="false" aria-controls={"collapse" + routeInfo.line_name}>
                Bus Details
      </button>
              <button className="btn btn-dark btn-sm collapsed  " type="button" data-toggle="collapse" style={{ "fontSize": 24 }}
                data-target={"#collapse" + routeInfo.line_name} aria-expanded="false" aria-controls={"collapse" + routeInfo.line_name}> +</button>
            </div>
         </div>


        <div id={"collapse" +  routeInfo.line_name } className="collapse" aria-labelledby={"heading" + routeInfo.line_name}
          data-parent="#accordionExample">
          <div className="card-body">
              <div className="row">

                <div className="col-sm-2 border border-dark">Line #</div>
                <div className="col-sm-2 border border-dark">Start Time</div>
                <div className="col-sm-2 border border-dark">End Time</div>
                {/* <div className="col-sm-2 border border-dark">Rd. Duration</div> */}
                <div className="col-sm-2 border border-dark">Start Up</div>
                <div className="col-sm-2 border border-dark">Close Down</div>
              </div>
              <div className = "row">
                <div className="col-sm-2 mr-0 border border-dark">
                  <RouteBusDisplay bus={routeInfo.bus_number}></RouteBusDisplay>
              </div>
                <div className="col-sm-2 border border-dark">{routeInfo.start_time}</div>
                <div className="col-sm-2 border border-dark">{routeInfo.end_time}</div>
                {/* <div className="col-sm-2 border border-dark">{routeInfo.round_dur}</div> */}
                <div className="col-sm-2 border border-dark">{routeInfo.opening_duration + "min."}</div>
                <div className="col-sm-2 border border-dark">{routeInfo.closing_duration + "min."}</div>
              </div>
      </div>
      {/*collapse  */}
        </div>
        </div>


        )
      }
      {/* returns JUST the bus # if the # is already associated with a route/line name */}
      return (
        <div key={routeInfo.line_name + routeInfo.bus_number} id={"collapse" + routeInfo.line_name} className="collapse" aria-labelledby={"heading" + routeInfo.line_name}
          data-parent="#accordionExample">
          <div className="card-body">
            <div className="row">

              <div className="col-sm-2 border border-dark">Line #</div>
              <div className="col-sm-2 border border-dark">Start Time</div>
              <div className="col-sm-2 border border-dark">End Time</div>
              {/* <div className="col-sm-2 border border-dark">Rd. Duration</div> */}
              <div className="col-sm-2 border border-dark">Start Up</div>
              <div className="col-sm-2 border border-dark">Close Down</div>
            </div>
            <div className="row">
              <div className="col-sm-2 mr-0 border border-dark">
                <RouteBusDisplay bus={routeInfo.bus_number}></RouteBusDisplay>
              </div>
              <div className="col-sm-2 border border-dark">{routeInfo.start_time}</div>
              <div className="col-sm-2 border border-dark">{routeInfo.end_time}</div>
              {/* <div className="col-sm-2 border border-dark">{routeInfo.round_dur}</div> */}
              <div className="col-sm-2 border border-dark">{routeInfo.opening_duration + "min."}</div>
              <div className="col-sm-2 border border-dark">{routeInfo.closing_duration + "min."}</div>
            </div>
          </div>
          {/*collapse  */}
        </div>

      )
    }
    ))

  }
      // createAccordianComponent(routeInfo){
//map through routeInfo
//create accordian component with information for each object that matches
        // if (!routeInfo){
        //   return;
        // }

      //  let line_name = routeInfo.map(routeInfo => routeInfo.line_name);
      //  let active_status = routeInfo.map(routeInfo => routeInfo.status);
      //  let public_status= routeInfo.map(routeInfo => routeInfo.public ).toString();
      //   let regular_service = routeInfo.map(routeInfo => routeInfo.regular_service).toString();
//         debugger;
//       return (
//       routeInfo.map((routeInfo, index) => { return (
//         <React.Fragment>
//           <div className = "row" id = {index}>
//         <div className="col">
//       <RouteBusDisplay route={routeInfo.line_name}></RouteBusDisplay>
//     </div>
//             <div className="col">{routeInfo.status}</div>
//             <div className="col">{routeInfo.public.toString()}</div>
//             <div className="col">{routeInfo.regular_service.toString()}</div>
//             <button className="btn btn-link col dropdown-toggle" type="button" data-toggle="collapse" data-target={`#collapse${routeInfo.line_name}`} aria-expanded="false" aria-controls={`collapse${routeInfo.line_name}`}>
//       Bus Details
//       </button>
//       <button className="btn btn-dark btn-sm " type="button" style={{ "fontSize": 24 }}> +</button>
//           </div>
//         </React.Fragment>
//       )})
// );
     // }

      // createBusComponent(busInfo){
      //   if (!busInfo) {
      //     return;
      //   }

        // let start_time = busInfo.map(busInfo => busInfo.start_time);
        // let end_time = busInfo.map(busInfo => busInfo.end_time);
        // let round_dur = busInfo.map(busInfo => busInfo.round_dur).toString() + "min.";
        // let open_dur = busInfo.map(busInfo => busInfo.opening_duration).toString() + "min";
        // let close_dur = busInfo.map(busInfo => busInfo.closing_duration).toString() + "min";
      //  return(
      //    busInfo.map((busInfo, index)=> { return (
      //    <div id={`collapse${busInfo.line_name}`} className="collapse " aria-labelledby="headingOne" data-parent="#accordionExample">
      //      <div className="card-body">
      //        <div className="row">

      //          <div className="col">Line #</div>
      //          <div className="col">Start Time</div>
      //          <div className="col">End Time</div>
      //          <div className="col">Rd. Duration</div>
      //          <div className="col">Start Up</div>
      //          <div className="col">Close Down</div>
      //        </div>
      //     <div className="col">
      //       <RouteBusDisplay bus={busInfo.bus_number}></RouteBusDisplay>
      //     </div>
      //       <div className="col">{busInfo.start_time}</div>
      //       <div className="col">{busInfo.end_time}</div>
      //       <div className="col">{busInfo.round_dur}</div>
      //       <div className="col">{busInfo.open_duration}</div>
      //       <div className="col">{busInfo.close_duration}</div>
      //      </div>
      //    </div>)})

      //  )
      // }




      componentDidMount(){
        this.handleRoutesInformation('api/admin-buses-routes.php', 'GET');
        this.handleBusesInformation('api/admin-buses-routes.php', 'GET');
      }
      handleRoutesInformation(url, method){
          fetch(url, { method: method })
             .then(response => { return response.json() })
            .then(routeInfo => {
            this.setState({
             routeInfo: routeInfo
            })
            console.log(routeInfo);
        })
      }
  handleBusesInformation(url, method) {
    fetch(url, { method: method })
      .then(response => { return response.json() })
      .then(busInfo => {
        this.setState({
          busInfo: busInfo
        })
        console.log(busInfo);
      })
  }
    render(){
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
              <div className="btn btn-outline-dark "> Add Route + </div>
          </div>
        </div>


        <div className = "container mt-2">
          <div className = "row">
              <div className ="col-sm-2 ml-2">Line</div>
              <div className="col-sm-2 ml-3">Active</div>
              <div className="col-sm-2 ml-4">Public</div>
              <div className="col-sm-2 ml-3">Regular Service</div>
          </div>
        </div>
          <div className="accordion" id="accordionExample">

            {/* <div className="card"> */}
{this.createRouteBusComponent(this.state.routeInfo)}
              {/*card closing tag */}
            {/* </div> */}

            {/*accordian closing tag*/}
          </div>
        </React.Fragment>
      );
    }
}

export default AdminRoutes;
