import React from 'react';
import TopMenuGeneral from '../../topmenu/topmenu-general';

class ShiftsAvailable extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <TopMenuGeneral title="Shifts - AVAILABLE"/>
        <div className="container" style={{ top: "40%", left: "40%", position: "absolute" }}>
        <div className="row d-inline" style={{ transform: "translate(-50%, -50%)" }} >Shifts Available</div>
        </div>
      </div>
      
    );
  }
}

export default ShiftsAvailable;
