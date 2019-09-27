import React from 'react';
import TopMenuShift from './topmenu/topmenu-shift';
import TopMenuGeneral from './topmenu/topmenu-general';
import TopMenuHamburger from './topmenu/topmenu-hamburger';
import Nav from './topmenu/range-nav-bar';
import RouteBusDisplay from './route-bus-display';

class AdminRoutes extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     session: null
  //   }

    render(){
      return (
        <React.Fragment>
        <TopMenuGeneral title="ADMIN - Routes/Buses" />
          {/* <TopMenuShift title="ADMIN - Routes/Buses" page='admin-routes' date="Fall Session"></TopMenuShift> */}
        <div className = "container mt-2">
          <div className = "row justify-content-end">
              <div className="btn btn-outline-dark "> Add Route + </div>
          </div>
        </div>
        <div className = "container mt-2">
          <div className = "row">
              <div className = "col">Line</div>
              <div className="col">Active</div>
              <div className="col">Public</div>
              <div className="col">Regular Service</div>
          </div>
        </div>

 {/*turn into "accordian component"*/}
          <div className="accordion" id="accordionExample">
            <div className="card">
              <div className="card-header" id="headingOne">
                <div className="container">
                  <div className = "row">
                    <div className = "col">
                      <RouteBusDisplay route="C"></RouteBusDisplay>
                    </div>
                    <div className="col">true</div>
                    <div className="col">true</div>
                    <div className="col">true</div>
                    <button className="btn btn-link col dropdown-toggle" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Bus Details
                   </button>
                   <button className= "btn btn-dark btn-sm col-sm" type="button"> </button>
                  </div>
                </div>
              </div>
              {/*turn into bus header component*/}
              <div id="collapseOne" className="collapse " aria-labelledby="headingOne" data-parent="#accordionExample">
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

                    <div className="col">
                      <RouteBusDisplay bus="1"></RouteBusDisplay>
                    </div>
                    <div className="col">6:00 a.m.</div>
                    <div className="col">10:00 a.m.</div>
                    <div className="col">15 min.</div>
                    <div className="col">30 min.</div>
                    <div className="col">45 min.</div>
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
                      <button className="btn btn-link col" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                        Bus Details
                   </button>
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
                        <button className="btn btn-link col" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                          Bus Details
                   </button>
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
