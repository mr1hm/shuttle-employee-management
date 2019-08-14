import React from 'react';
import TopMenuGeneral from '../topmenu/topmenu-general';

class Login extends React.Component {
  render(){
    return(
      <React.Fragment>
          <TopMenuGeneral title="LOGIN" />
          <div className="container" style={{ top: "40%", left: "40%", position: "absolute" }}>
            <div className="row d-inline" style={{ transform: "translate(-50%, -50%)" }} >Login</div>
          </div>
      </React.Fragment>
    );
  };
}

export default Login;

