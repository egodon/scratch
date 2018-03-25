import React, { Component } from 'react';
import { HelpBlock, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';
import config from '../config';
import LoaderButton from '../components/LoaderButton';
import './Signup.css';

export default class Signup extends Component {
  state = {
    isLoading: false,
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
    newUser: null,
  };

  validateForm = () =>
    this.state.email.length > 0 &&
    this.state.password.length > 0 &&
    this.state.password === this.state.confirmPassword;

  validateConfirmationForm = () => this.state.confirmationCode.length > 0;

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ isLoading: true });

    try {
      const newUser = await this.signup(this.state.email, this.state.password);
      this.setState({ newUser });
    } catch (e) {
      console.error(e);
    }

    this.setState({ isLoading: false });
  };

  handleConfirmationSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      await this.confirm(this.state.newUser, this.state.confirmationCode);
      await this.authenticate(this.state.newUser, this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
      this.props.history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  signup = (email, password) => {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID,
    });

    return new Promise((resolve, reject) =>
      userPool.signUp(email, password, [], null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.user);
      }));
  };

  confirm = (user, confirmationCode) =>
    new Promise((resolve, reject) =>
      user.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      }));

  authenticate = (user, email, password) => {
    const authenticationData = {
      Username: email,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(),
        onFailure: err => reject(err),
      }));
  };

  renderConfirmationForm = () => (
    <form onSubmit={this.handleConfirmationSubmit}>
      <FormGroup controlId="confirmationCode" bsSize="large">
        <ControlLabel>Confirmation Code</ControlLabel>
        <FormControl
          autoFocus
          type="tel"
          value={this.state.confirmationCode}
          onChange={this.handleChange}
        />
        <HelpBlock>Please check your email for the code.</HelpBlock>
      </FormGroup>
      <LoaderButton
        block
        bsSize="large"
        disabled={!this.validateConfirmationForm()}
        type="submit"
        isLoading={this.state.isLoading}
        text="Verify"
        loadingText="Verifying…"
      />
    </form>
  );

  renderForm = () => (
    <form onSubmit={this.handleSubmit}>
      <FormGroup controlId="email" bsSize="small">
        <ControlLabel>Email</ControlLabel>
        <FormControl autoFocus type="email" value={this.state.email} onChange={this.handleChange} />
      </FormGroup>
      <FormGroup controlId="password" bsSize="small">
        <ControlLabel>Password</ControlLabel>
        <FormControl value={this.state.password} onChange={this.handleChange} type="password" />
      </FormGroup>
      <FormGroup controlId="confirmPassword" bsSize="small">
        <ControlLabel>Confirm Password</ControlLabel>
        <FormControl
          value={this.state.confirmPassword}
          onChange={this.handleChange}
          type="password"
        />
      </FormGroup>
      <LoaderButton
        block
        bsSize="small"
        disabled={!this.validateForm()}
        type="submit"
        isLoading={this.state.isLoading}
        text="Signup"
        loadingText="Signing up…"
      />
    </form>
  );
  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null ? this.renderForm() : this.renderConfirmationForm()}
      </div>
    );
  }
}
