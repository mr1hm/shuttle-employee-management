import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Welcome from './welcome/welcome';
import TopMenu from './nav/topmenu/topmenu';
import ShiftsWeek from './shifts/week/shifts-week';

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
  render(){
    return (
        <div>
          <TopMenu/>
          <Switch>
            <Route path="/" exact component={this.loginView} />
            <Route path="/welcome/" component={Welcome} />
            <Route path="/shifts/week" component={ShiftsWeek} />
          </Switch>
        </div>
    );
  }
}
export default App;
