import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./layout/Layout";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <Switch>
      <Route path="/">
        <Layout />
      </Route>
    </Switch>
  );
}

export default App;

const object = {
  number1: 1,
  number2: 3,
  sum() {
    return this.number1 + this.number2;
  }
}

let sum = object.sum()
