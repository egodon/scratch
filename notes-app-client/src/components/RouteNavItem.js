import React from 'react';
import { Route } from 'react-router-dom';
import { NavItem } from 'react-bootstrap';

export default (props) => (
  <Route path={props.href} exact>
    {({ match, history }) => (
      <NavItem
        onClick={(e) => {
          e.preventDefault();
          history.push(e.currentTarget.getAttribute('href'));
        }}
        {...props}
        active={!!match}
      >
        {props.children}
      </NavItem>
    )}
  </Route>
);
