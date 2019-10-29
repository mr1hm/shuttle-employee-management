import React from 'react';
import TopMenuGeneral from '../../topmenu/topmenu-general';
import ShiftsDay from '../day/shifts-day';

class ShiftsAvailable extends React.Component {
  constructor(props) {
    super(props);

  }

  // only fetch available shifts
  render() {
    return (
      <div>
        <TopMenuGeneral userId={this.props.userId} title="Shifts - AVAILABLE"/>
      </div>

    );
  }
}

export default ShiftsAvailable;
