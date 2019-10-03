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
    console.log("app props",props.state);
    this.state = {
      userLogin: false,
      userId: [],
      // presetDateForTesting: 1566172800000
      presetDateForTesting: 1560409200000
      // presetDateForTesting: 1563951600000
    }
    this.setLoginProps = this.setLoginProps.bind(this);
    this.getUserID = this.getUserID.bind(this);
  }

  getUserID(){
    return this.state.userId;
  }

  setLoginProps(userIdNumber){
    console.log("from loginn", userIdNumber);
    console.log("setloginprops",this.props.state);
      this.setState({
        userId: userIdNumber,
        userLogin: true
      });
    console.log("app state", this.state);
  }

  render(){
    const userStateId = parseInt(this.state.userId);
    console.log("userNotLogin", this.state);
    console.log("userID", userStateId);
    if(this.state.userLogin === true){
      console.log("true state ", userStateId);
      return (
        <React.Fragment>
          <Switch>
            <Route exact path={['/', '/welcome/']} render={(props) => <Welcome {...props} userId={this.state.userId} />} />
            <Route path="/myinfo/" render={(props) => <MyInfo {...props} userId={this.state.userId} get={this.getUserID} />} />
            <Route path="/shifts/week/shifts-week/:date?" render={(props) => <ShiftsWeek userId={this.state.userId} {...props} defaultDate={this.state.presetDateForTesting} />} />
            <Route path="/shifts/day/shifts-day/:date?" render={(props) => <ShiftsDay {...props} userId={this.state.userId} view="myShifts" defaultDate={this.state.presetDateForTesting} />} />
            <Route path="/shifts/month/shifts-month/:date?" render={(props) => <ShiftsMonth userId={this.state.userId} {...props} defaultDate={this.state.presetDateForTesting} />} />
            <Route path="/shifts/available/:date?" render={(props) => <ShiftsDay userId={this.state.userId} {...props} view="availableShifts" defaultDate={this.state.presetDateForTesting} />} />
            <Route path="/shifts/details/" render={(props) => <ShiftsDetails userId={this.state.userId} {...props} />} />
            <Route path="/admin-day/" render={(props) => <AdminShiftsDay userId={this.state.userId} {...props} defaultDate={this.state.presetDateForTesting} />} />
          </Switch>
        </React.Fragment>
      );
    }
    if (this.state.userLogin === false) {
      console.log("false state",userStateId);
    return (
        <React.Fragment>

          <Switch>
          <Route exact path={['/', '/login/']} render={(props) => <Login {...props} onClick={this.setLoginProps} onChange={this.getUserID} />} />
          <Route path="/welcome/" render={(props) => <Welcome {...props}   />}/>
          <Route path="/myinfo/" render={(props) => <MyInfo {...props} userId={this.state.userId} />}/>
            <Route path = "/shifts/week/shifts-week/:date?" render={(props) => <ShiftsWeek {...props} defaultDate={this.state.presetDateForTesting}  />}/>
            <Route path = "/shifts/day/shifts-day/:date?" render={(props) => <ShiftsDay {...props} view="myShifts" defaultDate={this.state.presetDateForTesting} />}/>
            <Route path = "/shifts/month/shifts-month/:date?" render={(props) => <ShiftsMonth {...props} defaultDate={this.state.presetDateForTesting} />}/>
            <Route path=  "/shifts/available/:date?" render = {(props) => <ShiftsDay {...props} view="availableShifts" defaultDate={this.state.presetDateForTesting} />}/>
            <Route path = "/shifts/details/" render={(props) => <ShiftsDetails {...props} />}/>
            <Route path = "/admin-day/" render={(props) => <AdminShiftsDay {...props} defaultDate={this.state.presetDateForTesting} />}/>
            <Route path="/admin-routes/" render={(props) => <AdminRoutes {...props} defaultDate={this.state.presetDateForTesting} />} />
          </Switch>
        </React.Fragment>
      );
    }
  }
}

export default App;
