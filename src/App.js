import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Login, Signup, PrivateRoute, Pending, Approved, Pending_Graph, Approved_Graph, Dashboard, Add } from './components';
import { appRoute } from './utils/constants';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min.js';
import '../src/assets/css/style.css'
import "react-toastify/dist/ReactToastify.css";

const { login, signup, dashboard, pending, approved, addInventories, approved_graph, pending_graph } = appRoute;

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path={login} component={Login} />
          <Route exact path={signup} component={Signup} />
          <PrivateRoute exact path={dashboard} component={Dashboard} />
          <PrivateRoute path={addInventories} component={Add} />
          <PrivateRoute path={approved} component={Approved} />
          <PrivateRoute path={pending} component={Pending} />
          <PrivateRoute path={approved_graph} component={Approved_Graph} />
          <PrivateRoute path={pending_graph} component={Pending_Graph} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;