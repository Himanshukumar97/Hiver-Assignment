import React from 'react';
import { BrowserRouter, Route, Switch, } from "react-router-dom";
import HomePage from "./pages/Home";

import './App.css';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>

          <Route path="/" exact>
            <HomePage />
          </Route>

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
