import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Login, PrivateRoute, Inventories, Dashboard, Add  } from './components';
import { appRoute } from './utils/constants';

const { login, dashboard, inventories, addInventories } = appRoute;

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path={login} component={Login} />
          <PrivateRoute exact path={dashboard} component={Dashboard} />
          <PrivateRoute path={inventories} component={Inventories} />
          <PrivateRoute path={addInventories} component={Add} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;