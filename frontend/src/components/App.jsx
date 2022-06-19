import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistedStore } from "../store";

import Dashboard from "./notes/Dashboard";
import Note from "./notes/Note";

const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistedStore}>
          <Router history={history}>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/note/:id" component={Note} />
            </Switch>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
