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
      presetDateForTesting: 1564383600000
    }
  }
  // loginView() {
  //   return (
  //     <div className="container" style={{ top: "40%", left: "40%", position: "absolute" }}>
  //       <div className="row d-inline" style={{ transform: "translate(-50%, -50%)" }} >Login</div>
  //     </div>
  //   );
  // }
  render(){
    return (
        <div>
          <Switch>
          <Route path = "/login/" render={(props) => <Login {...props} />}/>
            <Route path = "/welcome/" render={(props) => <Welcome {...props}  />}/>
            <Route path = "/myinfo/" render={(props) => <MyInfo {...props} />}/> 
            <Route path = "/shifts/week/shifts-week/:date?" render={(props) => <ShiftsWeek {...props} defaultDate={this.state.presetDateForTesting}  />}/>
            <Route path = "/shifts/day/:date" render={(props) => <ShiftsDay {...props} date={this.state.presetDateForTesting}  />}/>
            <Route path = "/shifts/month/shifts-month/:date?" render={(props) => <ShiftsMonth {...props} defaultDate={this.state.presetDateForTesting}  />}/>
            <Route path = "/shifts/available" render={(props) => <ShiftsAvailable {...props} date={this.state.presetDateForTesting} />}/>        
          </Switch>
        </div>
    );
  }
}
export default App;
