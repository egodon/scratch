import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
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

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  handleLogout = e => {
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
          <Navbar fluid collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">Scratch</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                {this.state.isAuthenticated ? (
                  <NavItem onClick={this.handleLogout}>Logout</NavItem>
                ) : (
                  [
                    <React.Fragment key={0}>
                      <RouteNavItem key={1} href="/signup">
                        Signup
                      </RouteNavItem>
                      <RouteNavItem key={2} href="/login">
                        Login
                      </RouteNavItem>
                    </React.Fragment>
                  ]
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps} />
        </div>
      )
    );
  }
}

export default withRouter(App);