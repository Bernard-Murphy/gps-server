import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import reducer from "./redux/reducer";
import { legacy_createStore as createStore } from "redux";

/**
 * Provider and store allows all components in the app to have access to the same data
 * Stops us from having to "drill" data from parent components to child components
 * createStore considered "legacy" even though it was latest method less than a year ago
 */

export const store = createStore(reducer);

/**
 * Define html block in /public/index.html to render the app
 * In this case, an empty div with the id "root"
 */
if (typeof document !== "undefined") {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <Provider store={store}>
      <BrowserRouter basename="/">
        <App />
      </BrowserRouter>
    </Provider>
  );
}
