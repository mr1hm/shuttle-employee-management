import React from 'react';
import TopMenu from '../../topmenu/topmenu';

class ShiftsAvailable extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <TopMenu title="AVAILABLE"/>
        <div className="container" style={{ top: "40%", left: "40%", position: "absolute" }}>
        <div className="row d-inline" style={{ transform: "translate(-50%, -50%)" }} >Shifts Available</div>
        </div>
      </div>
      
    );
  }
}

export default ShiftsAvailable;
