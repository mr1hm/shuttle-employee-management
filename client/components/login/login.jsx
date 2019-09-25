import React from 'react';
import App from '../app'
import TopMenuGeneral from '../topmenu/topmenu-general';
import Welcome from '../welcome/welcome'
import "./login.css";

class Login extends React.Component {
  constructor(props){
    super(props);
    console.log(props);
    this.state = {
      userID : null,
      email:null,
      password:null,
      loginError:false
    }
    this.checkLoginInfo = this.checkLoginInfo.bind(this);
    this.handlechange = this.handlechange.bind(this);
  }

  handlechange(event){
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  checkLoginInfo(event) {
    console.log("event",event);
    event.preventDefault();
    const email = this.state.email;
    console.log("email",email);
    const password = this.state.password;
    console.log("password",password);
    const form = new FormData(event.target);
    form.append("email", email);
    form.append("password",password);
    fetch(`/api/login-page.php`, {
      method: 'POST',
      body: form,
    })
      .then(response => {
        return response.json()
      })
      .then(response => {
        console.log("suc", response[0]);
        this.setState({
          userID:response[0]
        });
        console.log("state",this.state.userID);
      })
      .catch(error => { throw (error) })
      .catch (()=>{this.setState({loginError:true});});
  }
  render(){
    console.log(this.state.userID);
    console.log(this.state.loginError);
    if(this.state.userID !== null){
      return(
        <React.Fragment>
          <Welcome {...this.state} />
        </React.Fragment>
      );
    }
    if(this.state.loginError === true){
      return (
        <React.Fragment>
          <TopMenuGeneral title="LOGIN" />
          <form className="loginForm" method="POST" encType="multipart/form-data" onSubmit={(event => this.checkLoginInfo(event))}>
            <div className="form-group">
              <label className="control-label text-danger" htmlFor="inputError">Invaild email</label>
              <input onChange={(event => this.handlechange(event))} pattern="^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$" type="email" name="email" className="form-control errorLogin text-center" id="inputError" placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label className="control-label text-danger" htmlFor="inputError">Invaild Password</label>
              <input onChange={(event => this.handlechange(event))} type="password" className="form-control errorLogin" id="inputError" name="password" placeholder="Password" />
            </div>
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="dropdownCheck2" />
              <label className="form-check-label" htmlFor="dropdownCheck2">
                Remember me
                  </label>
            </div>
            <button type="submit" className="btn btn-primary">Sign in</button>
          </form>
        </React.Fragment>
      );
    }
    return(
      <React.Fragment>
          <TopMenuGeneral title="LOGIN" />
        <form className="loginForm" method="POST" encType="multipart/form-data" onSubmit={(event => this.checkLoginInfo(event))}>
            <div className="form-group">
               <label htmlFor="exampleDropdownFormEmail2">Email address</label>
            <input onChange={(event => this.handlechange(event))} pattern="^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$" type="email" name="email" className="form-control" id="email" placeholder="email@example.com"/>
            </div>
            <div className="form-group">
                <label htmlFor="exampleDropdownFormPassword2">Password</label>
            <input onChange={(event => this.handlechange(event))}  type="password" className="form-control" id="password" name="password" placeholder="Password"/>
            </div>
                <div className="form-check">
            <input type="checkbox" className="form-check-input" id="dropdownCheck2"/>
                  <label className="form-check-label" htmlFor="dropdownCheck2">
                      Remember me
                  </label>
             </div>
                  <button type="submit" className="btn btn-primary">Sign in</button>
           </form>
      </React.Fragment>
    );
  };
}

export default Login;
