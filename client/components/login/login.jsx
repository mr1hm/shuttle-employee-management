import React from 'react';
import { connect } from 'react-redux';
import { userLogin } from '../../actions';
import './login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      rememberMe: false,
      loginError: null
    };
    this.checkLoginInfo = this.checkLoginInfo.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.email.focus();
  }

  handleInputChange({ target: { name, value } }) {
    this.setState({
      [name]: value
    });
  }

  handleCheckChange({ target: { name, value } }) {
    this.setState({
      [name]: value === 'false'
    });
  }

  async checkLoginInfo(event) {
    event.preventDefault();
    const { email, password, rememberMe } = this.state;
    const { userLogin } = this.props;

    try {
      await userLogin({ email, password, rememberMe });
    } catch (error) {
      this.setState({
        loginError: error.message
      });
      this.pass.focus();
      this.pass.select();
    }
  }
  render() {
    const { loginError, password, email, rememberMe } = this.state;
    const inputClass = loginError ? 'form-control errorLogin' : 'form-control';
    const errorDisplay = <div className="text-danger">{loginError}</div>;

    return (
      <>
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
              <input ref={e => { this.email = e; }} value={email} onChange={this.handleInputChange} type="email" name="email" className={inputClass} id="email" placeholder="email@example.com" autoComplete="username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input ref={e => { this.pass = e; }} value={password} onChange={this.handleInputChange} type="password" className={inputClass} id="password" name="password" placeholder="Password" autoComplete="current-password"/>
            </div>
            <div className="form-check mb-2">
              <input className="form-check-input" onChange={this.handleCheckChange} type="checkbox" value={rememberMe} id="rememberMe" name="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
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

<<<<<<< HEAD
export default Login;

=======
export default connect(null, {
  userLogin
})(Login);
>>>>>>> 2104ba19b95d2356742687f48d902a6831e8d25d
