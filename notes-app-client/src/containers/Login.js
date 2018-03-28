import React, { Component } from 'react';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import LoaderButton from '../components/LoaderButton';
import config from '../config';

import './Login.css';

export default class Login extends Component {
  state = {
    isLoading: false,
    email: '',
    password: '',
  };

  validateForm = () => {
    return this.state.email.length > 0 && this.state.password.length > 0;
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  login = (email, password) => {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID,
    });

    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => {
      user.authenticateUser(authenticationDetails, {
        onSuccess: (result) => resolve(),
        onFailure: (err) => reject(err),
      });
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    try {
      await this.login(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormControl className="input-field">
            <InputLabel>Email</InputLabel>
            <Input
              autoFocus
              id="email"
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormControl>
          <FormControl className="input-field">
            <InputLabel>Password</InputLabel>
            <Input
              id="password"
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormControl>
          <LoaderButton
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            className="btn-login"
            loadingText="Logging in…"
          />
        </form>
      </div>
    );
  }
}
