import React from 'react';
import { connect } from 'react-redux';
import { userLogin } from '../../actions';
import TopMenuGeneral from '../topmenu/topmenu-general';
import './login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      email: 'asdasd@asd.com',
      password: 'asd',
      loginError: false
    };
    this.checkLoginInfo = this.checkLoginInfo.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async checkLoginInfo(event) {
    event.preventDefault();
    const { email, password } = this.state;
    const { userLogin } = this.props;

    await userLogin({ email, password }, event.target);
    // const form = new FormData(event.target);
    // form.append('email', email);
    // form.append('password', password);
    // fetch(`/api/login-page.php`, {
    //   method: 'POST',
    //   body: form
    // })
    //   .then(response => response.json())
    //   .then(response => {
    //     console.log('Rsponse:', response);
    //     // this.setState({
    //     //   userID: response[0]
    //     // });
    //     // this.props.onClick(this.state.userID);
    //   });
    // // .catch(() => { this.setState({ loginError: true }); });
  }
  render() {
    const { loginError, password, email } = this.state;
    const inputClass = loginError ? 'form-control errorLogin' : 'form-control';
    const errorDisplay = <div className="text-danger">Invalid Email or Password</div>;
    return (
      <>
        <TopMenuGeneral userId={this.props.userId} title="LOGIN" />
        <div className="container mt-5 d-flex justify-content-center">
          <form className="w-50" encType="multipart/form-data" onSubmit={this.checkLoginInfo}>
            <div className="form-group">
              <div className="row">
                <div className="col">
                  <label htmlFor="email">Email address</label>
                </div>
                <div className="col text-right">
                  {loginError && errorDisplay}
                </div>
              </div>
              <input value={email} onChange={this.handleInputChange} pattern="^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$" type="email" name="email" className={inputClass} id="email" placeholder="email@example.com" autoComplete="username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input value={password} onChange={this.handleInputChange} type="password" className={inputClass} id="password" name="password" placeholder="Password" autoComplete="current-password"/>
            </div>
            <div className="form-check mb-2">
              <input className="form-check-input" type="checkbox" value="" id="checkbox" />
              <label className="form-check-label" htmlFor="checkbox">
                Remember Me
              </label>
            </div>
            <button className="btn btn-primary">Sign in</button>
          </form>
        </div>
      </>
    );
  }
}

export default connect(null, {
  userLogin
})(Login);
