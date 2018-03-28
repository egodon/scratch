import React from 'react';
import { Route } from 'react-router-dom';

export default (props) => (
  <Route path={props.href} exact>
    {({ match, history }) => (
      <li>
        <a
          onClick={(e) => {
            e.preventDefault();
            history.push(e.currentTarget.getAttribute('href'));
          }}
          {...props}
        >
          {props.children}
        </a>
      </li>
    )}
  </Route>
);
