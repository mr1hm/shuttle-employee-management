import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Welcome from './welcome/welcome';
import TopMenu from './nav/topmenu/topmenu';
import ShiftsWeek from './shifts/weeks/shifts-week';
import ShiftsMonth from './shifts/month/shifts-month';

 class App extends React.Component {
  constructor(props){
    super(props);
  }

  loginView() {
    return (
          <div className="container" style={{ top: "40%", left: "20%", position: "absolute" }}>
            <div className="row" style={{ display: "inline", transform: "translate(-50%, -50%)"}} > 
            This will be where Login, Welcome, and Shift will render</div>
          </div>
    );
  }

  getDayOfWeekForFirstOfCurrentMonth() {
    var today = new Date();
    var dateObjOfFirstOfCurrentMonth = new Date(today.getFullYear(), today.getMonth());
    console.log(dateObjOfFirstOfCurrentMonth.getDay());
    return dateObjOfFirstOfCurrentMonth.getDay();
  }  

  render(){
    return (
        <div>
          <TopMenu/>
          <Switch>
            <Route path="/" exact component={this.loginView} />
            <Route path="/welcome/" component={Welcome} />
            <Route path="/shifts/week" component={ShiftsWeek} />
            <Route path="/shifts/month/shifts-month/" component={ShiftsMonth} />
          </Switch>
        </div>
    );
  }
}
export default App;


