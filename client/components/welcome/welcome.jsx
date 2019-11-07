import React from 'react';
import TopMenuGeneral from '../topmenu/topmenu-general';
import StrictNotification from '../strict-notification-modal';
import './welcome.css';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newShiftsandSelectedDriver: '',
      availableShiftsSubmitted: 0,
      sessionId: 1
    };
  }
  componentDidMount() {
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'session_id': this.state.sessionId
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`/api/admin-operator-availability.php`, data)
      .then(response => response.json())
      .then(data => {
        const newShiftsandSelectedDriver = this.props.location.state;
        const operator = data.filter(operator => operator.id === this.props.userId);
        this.setState({
          availableShiftsSubmitted: operator[0].submitted,
          newShiftsandSelectedDriver: newShiftsandSelectedDriver
        });
      })
      .catch(error => { throw (error); });
  }
  render() {
    if (this.state.availableShiftsSubmitted !== 1) {
      return (
        <StrictNotification />
      );
    }
    return (
      <div className="container-fluid d-flex flex-column h-100 justify-content-around yellow">
        <div className="row">
          <div className="col">
            <TopMenuGeneral userId={this.props.userId} title="WELCOME" newShiftsandSelectedDriver={this.state.newShiftsandSelectedDriver} />
          </div>
        </div>
        <div className="row h-50 justify-content-center">
          <div className="col-md-6 col-10 text-center d-flex align-items-center justify-content-center blue">
            <h1>VERMINLINGUA<br/>EXPRESS</h1>
          </div>
        </div>
        <div className="row pb-5 d-flex justify-content-center justify-self-end">
          <div className="col-10 text-center">
            Vermilingua Express is a University's campus bus system. Our website is the shift scheduling platform for student drivers and administrators. It lets the drivers read, add, remove, trade, and swap desired shifts. Administrators are able to set up initial shifts and accept ordeny changes requested by drivers.
          </div>
        </div>
      </div>
    );
  }

}

export default Welcome;
