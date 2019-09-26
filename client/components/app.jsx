import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MyInfo from './myinfo/myinfo';
import ShiftsWeek from './shifts/week/shifts-week';
import ShiftsDay from './shifts/day/shifts-day';
import ShiftsMonth from './shifts/month/shifts-month';
import ShiftsAvailable from './shifts/available/shifts-available';
import ShiftsDetails from './shifts/details/shifts-details';
import Login from './login/login';
import Welcome from './welcome/welcome';
import Modal from './post-modal';
import AdminShiftsDay from './admin-shifts';
import AdminRoutes from './admin-routes-buses';
import './post-modal.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      // presetDateForTesting: 1566172800000
      presetDateForTesting: 1560409200000
      // presetDateForTesting: 1563951600000
    }
  }

  render(){
    return (
        <React.Fragment>
        <AdminRoutes></AdminRoutes>
          {/* <Switch>
          <Route path="/login/" render={(props) => <Login {...props}   />}/>
          <Route exact path={['/', '/welcome/']} render={(props) => <Welcome {...props}   />}/>
          <Route path="/myinfo/" render={(props) => <MyInfo {...props}  />}/>
            <Route path = "/shifts/week/shifts-week/:date?" render={(props) => <ShiftsWeek {...props} defaultDate={this.state.presetDateForTesting}  />}/>
            <Route path = "/shifts/day/shifts-day/:date?" render={(props) => <ShiftsDay {...props} view="myShifts" defaultDate={this.state.presetDateForTesting} />}/>
            <Route path = "/shifts/month/shifts-month/:date?" render={(props) => <ShiftsMonth {...props} defaultDate={this.state.presetDateForTesting} />}/>
            <Route path=  "/shifts/available/:date?" render = {(props) => <ShiftsDay {...props} view="availableShifts" defaultDate={this.state.presetDateForTesting} />}/>
            <Route path = "/shifts/details/" render={(props) => <ShiftsDetails {...props} />}/>
            <Route path = "/admin-day/" render={(props) => <AdminShiftsDay {...props} defaultDate={this.state.presetDateForTesting} />}/>
          </Switch> */}
        </React.Fragment>
    );
  }
}

export default App;
