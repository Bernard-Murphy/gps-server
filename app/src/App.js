import { Route, Switch, useLocation, Redirect } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { connect } from "react-redux";
import Login from "./pages/Login";
import Laptops from "./pages/Laptops";

const App = () => {
  let location = useLocation();

  /**
   * Currently using React Router 5
   * React Router 6 recently released; stupidly not made backwards-compatible and removes numerous features with no replacement
   */

  return (
    /**
     * AnimatePresence tells the child components to use framer motion page transitions
     * exitBeforeEnter flag makes sure the exit transition completes before the entrance on the next page initiates
     * The "key" in the Switch is necessary for animations to work properly. Needs to be unique on every page change, hence setting it to location.pathname
     */
    <AnimatePresence exitBeforeEnter>
      <Switch location={location} key={location.pathname}>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/laptops">
          <Laptops />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </AnimatePresence>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps, {})(App);
