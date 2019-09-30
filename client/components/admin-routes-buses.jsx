import React from 'react';
import TopMenuShift from './topmenu/topmenu-shift';
import TopMenuGeneral from './topmenu/topmenu-general';
import TopMenuHamburger from './topmenu/topmenu-hamburger';
import Nav from './topmenu/range-nav-bar';
import RouteBusDisplay from './route-bus-display';


class AdminRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: null,
      routeInfo: []
    }
  }
      createAccordianComponent(routeInfo){
//map through routeInfo
//create accordian component with information for each object that matches
        if (!routeInfo){
          return;
        }

       let line_name = routeInfo.map(routeInfo => routeInfo.line_name);
       let active_status = routeInfo.map(routeInfo => routeInfo.status);
       let public_status= routeInfo.map(routeInfo => routeInfo.public ).toString();
        let regular_service = routeInfo.map(routeInfo => routeInfo.regular_service).toString();
        return (
            <React.Fragment>
                  <div className="col">
                    <RouteBusDisplay route={line_name[0]}></RouteBusDisplay>
                  </div>
                  <div className="col">{active_status[0]}</div>
                  <div className="col">{public_status}</div>
                  <div className="col">{regular_service}</div>
                  <button className="btn btn-link col dropdown-toggle" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Bus Details
                   </button>
                  <button className="btn btn-dark btn-sm " type="button" style={{ "fontSize": 24 }}> +</button>
          </React.Fragment>
        )
            }

      createBusComponent(){
       return(
       <React.Fragment>
          <div className="col">
            <RouteBusDisplay bus="1"></RouteBusDisplay>
          </div>
            <div className="col">6:00 a.m.</div>
            <div className="col">10:00 a.m.</div>
            <div className="col">15 min.</div>
            <div className="col">30 min.</div>
            <div className="col">45 min.</div>
        </React.Fragment>
       )
      }




      componentDidMount(){
        this.handleRoutesAndBusesInformation('api/dummy-data/dummy-data-admin-routes-buses.json', 'GET');
      }
      handleRoutesAndBusesInformation(url, method){
          fetch(url, { method: method })
             .then(response => { return response.json() })
            .then(routeInfo => {
            this.setState({
             routeInfo: routeInfo
            })
            console.log(routeInfo);
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

 {/*turn into "accordian component"*/}
          <div className="accordion" id="accordionExample">
            <div className="card">
              <div className="card-header" id="headingOne">
                <div className="container">
                  <div className = "row">
                    {this.createAccordianComponent(this.state.routeInfo)}
                    {/* {this.createBusComponent(this.state.routeInfo)} */}
                    {/* <div className = "col">
                      <RouteBusDisplay route="C"></RouteBusDisplay>
                    </div>
                    <div className="col">true</div>
                    <div className="col">true</div>
                    <div className="col">true</div>
                    <button className="btn btn-link col dropdown-toggle" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Bus Details
                   </button>
                   <button className= "btn btn-dark btn-sm " type="button" style={{"fontSize": 24}}> +</button> */}
                  </div>
                </div>
              </div>
              {/*turn into bus header component*/}
              <div id="collapseOne" className="collapse " aria-labelledby="headingOne" data-parent="#accordionExample">
                <div className="card-body">
                  <div className="row">

                    <div className="col">Line #</div>
                    <div className="col">Start Time</div>
                    <div className="col">End Time</div>
                    <div className="col">Rd. Duration</div>
                    <div className="col">Start Up</div>
                    <div className="col">Close Down</div>
                  </div>
                  <div className="row">

                    <div className="col">
                      <RouteBusDisplay bus="1"></RouteBusDisplay>
                    </div>
                    <div className="col">6:00 a.m.</div>
                    <div className="col">10:00 a.m.</div>
                    <div className="col">15 min.</div>
                    <div className="col">30 min.</div>
                    <div className="col">45 min.</div>
                  </div>
                  <div className="row">

                    <div className="col">
                      <RouteBusDisplay bus="2"></RouteBusDisplay>
                    </div>
                    <div className="col">6:20 a.m.</div>
                    <div className="col">10:20 a.m.</div>
                    <div className="col">15 min.</div>
                    <div className="col">30 min.</div>
                    <div className="col">45 min.</div>
                  </div>
                </div>
                </div>
              </div>
            </div>
            {/*turn into "accordian route component"*/}
            <div className="accordion" id="accordionExample">
              <div className="card">
                <div className="card-header" id="headingTwo">
                  <div className="container">
                    <div className="row">
                      <div className="col">
                        <RouteBusDisplay route="D"></RouteBusDisplay>
                      </div>
                      <div className="col">true</div>
                      <div className="col">true</div>
                      <div className="col">true</div>
                      <button className="btn btn-link col dropdown-toggle" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                        Bus Details
                   </button>
                      <button className="btn btn-dark btn-sm " type="button" style={{ "fontSize": 24 }}> +</button>
                    </div>
                  </div>
                </div>
        {/*turn into bus header component*/}
                <div id="collapseTwo" className="collapse " aria-labelledby="headingTwo" data-parent="#accordionExample">
                  <div className="card-body">
                    <div className="row">

                      <div className="col">#</div>
                      <div className="col">Start Time</div>
                      <div className="col">End Time</div>
                      <div className="col">Rd. Duration</div>
                      <div className="col">Start Up</div>
                      <div className="col">Close Down</div>
                    </div>
                    <div className ="row">
                      <div className="col">No buses added</div>
                  </div>
                </div>
              </div>
              {/*turn into "accordian component"*/}
              <div className="accordion" id="accordionExample">
                <div className="card">
                  <div className="card-header" id="headingThree">
                    <div className="container">
                      <div className="row">
                        <div className="col">
                          <RouteBusDisplay route="M"></RouteBusDisplay>
                        </div>
                        <div className="col">true</div>
                        <div className="col">true</div>
                        <div className="col">true</div>
                        <button className="btn btn-link col dropdown-toggle" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                          Bus Details
                   </button>
                        <button className="btn btn-dark btn-sm " type="button" style={{ "fontSize": 24 }}> +</button>
                      </div>
                    </div>
                  </div>

                  <div id="collapseThree" className="collapse " aria-labelledby="headingThree" data-parent="#accordionExample">
                    <div className="card-body">
                      <div className="row">

                        <div className="col">#</div>
                        <div className="col">Start Time</div>
                        <div className="col">End Time</div>
                        <div className="col">Rd. Duration</div>
                        <div className="col">Start Up</div>
                        <div className="col">Close Down</div>
                      </div>
                      <div className="row">
                        <div className="col">No buses added</div>
                      </div>
                    </div>
                  </div>
                </div>

                </div>
                </div>
                </div>

        </React.Fragment>
      );
    }
}

export default AdminRoutes;
