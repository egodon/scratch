import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Routes from './Routes';
import RouteNavItem from './components/RouteNavItem';
import { authUser, signOutUser } from './libs/awsLib';
import './App.css';

class App extends Component {
  state = {
    isAuthenticated: false,
    isAuthenticating: true,
  };

  async componentDidMount() {
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true);
      }
    } catch (e) {
      console.error(e);
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = (authenticated) => {
    this.setState({ isAuthenticated: authenticated });
  };

  handleLogout = (e) => {
    signOutUser();
    this.userHasAuthenticated(false);
    this.props.history.push('./login');
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
    };

    return (
      !this.state.isAuthenticating && (
        <div className="App container">
          <AppBar position="static" className="nav">
            <Toolbar className="nav-bar">
              <Typography variant="title" color="inherit">
                <Link to="/">Scratch</Link>
              </Typography>
              <ul>
                {this.state.isAuthenticated ? (
                  <RouteNavItem onClick={this.handleLogout}>Logout</RouteNavItem>
                ) : (
                  <Fragment>
                    <RouteNavItem key={1} href="/signup">
                      Signup
                    </RouteNavItem>
                    <RouteNavItem key={2} href="/login">
                      Login
                    </RouteNavItem>
                  </Fragment>
                )}
              </ul>
            </Toolbar>
          </AppBar>
          <Routes childProps={childProps} />
        </div>
      )
    );
  }
}

export default withRouter(App);
