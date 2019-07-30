import React from 'react';

class ShiftsWeek extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      // <React.Fragment>
      //   <div className="container" style={{ top: "5%", left: "80%", position: "absolute" }}>
      //     <div className = "row">Week Shifts View</div>
      //   </div>
      //   <div style={{ top: "5%", left: "1%", position: "absolute" }}>
      //     <div>View Month</div>
      //   </div>
      //   <div className="container" style={{ top: "40%", left: "40%", position: "absolute" }}>
      //     <div className = "row ">View Day</div>
      //     <div className = "row mt-5">View Day</div>
      //     <div className = "row mt-5">View Day</div>
      //   </div>

      // </React.Fragment>
      <div className="container" style={{ top: "40%", left: "40%", position: "absolute" }}>
      <div className="row d-inline" style={{ transform: "translate(-50%, -50%)" }} >My Shifts - WEEK</div>
    </div>
    );
  }
}

export default ShiftsWeek;
