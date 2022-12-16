import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as microsoftTeams from "@microsoft/teams-js";
import { BrowserRouter } from "react-router-dom";

// Initialize the Microsoft Teams SDK
microsoftTeams.initialize();

ReactDOM.render(
  <BrowserRouter>
      <App
        configUrl={process.env.REACT_APP_CONFIG_URL}
        backendUrl={process.env.REACT_APP_BACKEND_URL}
      />
  </BrowserRouter>,
  document.getElementById("root")
);
