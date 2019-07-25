import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Welcome from './welcome';


 class App extends React.Component {
  constructor(props){
    super(props);
  }


  render(){
    return (
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Login</Link>
              </li>
              <li>
                <Link to="/welcome/">Go to Welcome Page</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path="/" exact component={this.loginView} />
            <Route path="/welcome/" component={Welcome} />
          </Switch>
        </div>
    );
  }
}
export default App;


