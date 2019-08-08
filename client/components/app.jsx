import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MyInfo from './myinfo/myinfo';
import ShiftsWeek from './shifts/week/shifts-week';
import ShiftsDay from './shifts/day/shifts-day';
import ShiftsMonth from './shifts/month/shifts-month';
import ShiftsAvailable from './shifts/available/shifts-available';
import Login from './login/login';
import Welcome from './welcome/welcome';

 class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      presetDateForTesting: 1565395200000
    }
  }

  render(){
    return (
        <div>
          <Switch>
          <Route path = "/login/" render={(props) => <Login {...props} />}/>
            <Route exact path = {['/','/welcome/']} render={(props) => <Welcome {...props}  />}/>
            <Route path = "/myinfo/" render={(props) => <MyInfo {...props} />}/>
            <Route path="/shifts/week/shifts-week/:date?" render={(props) => <ShiftsWeek {...props} defaultDate={this.state.presetDateForTesting}  />}/>
            <Route path = "/shifts/day/shifts-day/:date?" render={(props) => <ShiftsDay {...props} defaultDate={this.state.presetDateForTesting} />}/>
            <Route path = "/shifts/month/shifts-month/:date?" render={(props) => <ShiftsMonth {...props} defaultDate={this.state.presetDateForTesting} />}/>
            <Route path = "/shifts/available" render={(props) => <ShiftsAvailable {...props} defaultDate={this.state.presetDateForTesting} />}/>
          </Switch>
        </div>
    );
  }
}
export default App;
