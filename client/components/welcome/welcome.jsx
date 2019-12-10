import React from 'react';
import TopMenuGeneral from '../topmenu/topmenu-general';

import './welcome.css';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newShiftsAndSelectedDriver: ''
    };
  }
  componentDidMount() {
    const newShiftsAndSelectedDriver = this.props.location.state;
    this.setState({
      newShiftsAndSelectedDriver: newShiftsAndSelectedDriver
    });
  }
  render() {
    return (
      <div className="container-fluid d-flex flex-column h-100 justify-content-around yellow">
        <div className="row">
          <div className="col">
            <TopMenuGeneral title="WELCOME" newShiftsAndSelectedDriver={this.state.newShiftsAndSelectedDriver} />
          </div>
        </div>
        <div className="row h-50 justify-content-center">
          <div className="col-md-6 col-10 text-center d-flex align-items-center justify-content-center blue">
            <h1>VERMINLINGUA<br/>EXPRESS</h1>
          </div>
        </div>
        <div className="row pb-5 d-flex justify-content-center justify-self-end">
          <div className="col-10 text-center">
            Vermilingua Express is a University's campus bus system. Our website is the shift scheduling platform for student drivers and administrators. It lets the drivers read, add, remove, trade, and swap desired shifts. Administrators are able to set up initial shifts and accept or deny changes requested by drivers.
          </div>
        </div>
      </div>
    );
  }

}

export default Welcome;
