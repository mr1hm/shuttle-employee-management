import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Welcome from './welcome/welcome';
import TopMenu from './nav/topmenu/topmenu';
import MyInfo from './myinfo/myinfo';
import ShiftsWeek from './shifts/week/shifts-week';
import ShiftsDay from './shifts/day/shifts-day';
import ShiftsMonth from './shifts/month/shifts-month';
import ShiftsAvailable from './shifts/available/shifts-available';

 class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      presetDateForTesting: 1564506000
    }
  }
  loginView() {
    return (
      <div className="container" style={{ top: "40%", left: "40%", position: "absolute" }}>
        <div className="row d-inline" style={{ transform: "translate(-50%, -50%)" }} >Login</div>
      </div>
    );
  }
  render(){
    return (
        <div>
          <TopMenu/>
          <Switch>
            <Route path = "/" exact component={this.loginView} render={(props) => <Dashboard {...props} date={this.state.presetDateForTesting} />}/>
            <Route path = "/welcome/" render={(props) => <Welcome {...props} date={this.state.presetDateForTesting} />}/>
            <Route path = "/myinfo/" render={(props) => <MyInfo {...props} date={this.state.unixTimestamp} />}/> 
            <Route path = "/shifts/week" render={(props) => <ShiftsWeek {...props} date={this.state.presetDateForTesting}  />}/>
            <Route path = "/shifts/day" render={(props) => <ShiftsDay {...props} date={this.state.presetDateForTesting}  />}/>
            <Route path = "/shifts/month" render={(props) => <ShiftsMonth {...props} date={this.state.presetDateForTesting}  />}/>
            <Route 
            path = "/shifts/available" render={(props) => <ShiftsAvailable {...props} date={this.state.presetDateForTesting} />}/>        
          </Switch>
        </div>
    );
  }
}
export default App;
