import React from 'react';
import TopMenuGeneral from '../../topmenu/topmenu-general';
import ShiftsDay from '../day/shifts-day';

class ShiftsAvailable extends React.Component {
  constructor(props) {
    super(props);

  }

  //only fetch available shifts
  render() {
    return (
      <div>
        <TopMenuGeneral title="Shifts - AVAILABLE"/>
        {/* <ShiftsDay></ShiftsDay>; */}
        {/* <div className="container" style={{ top: "40%", left: "40%", position: "absolute" }}>
        <div className="row d-inline" style={{ transform: "translate(-50%, -50%)" }} >Shifts Available</div>
        </div> */}

      </div>

    );
  }
}

export default ShiftsAvailable;
