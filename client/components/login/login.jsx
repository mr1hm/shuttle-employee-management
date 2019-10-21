import React from 'react';
import TopMenuGeneral from '../topmenu/topmenu-general';
import './login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      email: null,
      password: null,
      loginError: false
    };
    this.checkLoginInfo = this.checkLoginInfo.bind(this);
    this.handlechange = this.handlechange.bind(this);
  }

  handlechange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  checkLoginInfo(event) {
    event.preventDefault();
    const { email, password } = this.state;
    const form = new FormData(event.target);
    form.append('email', email);
    form.append('password', password);
    fetch(`/api/login-page.php`, {
      method: 'POST',
      body: form
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          userID: response[0]
        });
        this.props.onClick(this.state.userID);
      })
      .catch(() => { this.setState({ loginError: true }); });
  }
  render() {
    const { loginError } = this.state;
    const inputClass = loginError ? 'form-control errorLogin' : 'form-control';
    const errorDisplay = <div className="text-danger">Invalid Email or Password</div>;
    return (
      <>
        <TopMenuGeneral title="LOGIN" />
        <div className="container mt-5 d-flex justify-content-center">
          <form className="w-50" encType="multipart/form-data" onSubmit={(event => this.checkLoginInfo(event))}>
            <div className="form-group">
              <div className="row">
                <div className="col">
                  <label htmlFor="email">Email address</label>
                </div>
                <div className="col text-right">
                  {loginError && errorDisplay}
                </div>
              </div>
              <input onChange={this.handlechange} pattern="^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$" type="email" name="email" className={inputClass} id="email" placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input onChange={this.handlechange} type="password" className={inputClass} id="password" name="password" placeholder="Password" />
            </div>
            <div className="form-check mb-2">
              <input className="form-check-input" type="checkbox" value="" id="checkbox" />
              <label className="form-check-label" htmlFor="checkbox">
                Remember Me
              </label>
            </div>
            <button type="submit" className="btn btn-primary">Sign in</button>
          </form>
        </div>
      </>
    );
  }
}

export default Login;
