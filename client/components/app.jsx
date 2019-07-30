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
            <Route path = "/" exact component={this.loginView} />
            <Route path = "/welcome/" component={Welcome} />
            <Route path = "/myinfo/" component={MyInfo} /> 
            <Route path = "/shifts/week" component={ShiftsWeek} />
            <Route path = "/shifts/day" component={ShiftsDay} />
            <Route path = "/shifts/month" component={ShiftsMonth} />
            <Route path = "/shifts/available" component={ShiftsAvailable} />            
          </Switch>
        </div>
    );
  }
}
export default App;


