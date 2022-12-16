// React imports
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Teams imports
import * as microsoftTeams from "@microsoft/teams-js";
import {
  Provider,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
import { Loader as MSLoader } from "@fluentui/react-northstar";

// Utility imports
import Page from "./Page";

import * as helper from "./helpers";
import LandingPage from "./LandingPage";
import TranscriptPage from "./TranscriptPage";

function App(props) {
  const [appAppearance, setAppAppearance] = useState(teamsTheme);
  const [pageConfig, setPageConfig] = useState({});
  const [simpleConfigIndex, setSimpleConfigIndex] = useState({});
  const [simpleConfig, setSimpleConfig] = useState({});
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    microsoftTeams.getContext((context) => {
      setAppAppearance(initTeamsTheme(context.theme));
      microsoftTeams.appInitialization.notifySuccess();
    });

    microsoftTeams.registerOnThemeChangeHandler((theme) => {
      setAppAppearance(initTeamsTheme(theme));
    });

    microsoftTeams.authentication.getAuthToken({
      successCallback: (authToken) => {
        setAuthToken(authToken);
      },
      failureCallback: (error) => {
        console.error("Failed to get auth", error);
      },
    });
  }, []);

  /** ----------------------- Getting page configurations from static webserver -----------------------*/
  useEffect(() => {
    console.log("Configure Server URL: " + props.configUrl);
    helper.getSimpleConfig(`${props.configUrl}/frontend/simpleConfig/`, "").then((pages) => {
      setSimpleConfigIndex({pages: pages});
    }).catch((error) => {
      console.error('error getting simple config', error);
    });
  }, [props.configUrl]);

  useEffect(() => {
    helper
      .getData(`${props.configUrl}/frontend/landingPageConfig.json`)
      .then((data) => {
        setPageConfig((prevState) => ({
          ...prevState,
          [data.id]: data,
        }));
      });
  }, [props.configUrl]);

  // Simple Config
  useEffect(() => {
    try {
      simpleConfigIndex?.pages?.forEach((page) => {
        helper
          .getData(`${props.configUrl}/frontend/simpleConfig/${page}`)
          .then((data) => {
            setSimpleConfig((prevState) => ({
              ...prevState,
              [data.system +
              data.interface +
              data.businessObject.split("/").pop() +
              data.pageType]: data,
            }));
          });
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  }, [simpleConfigIndex, props.configUrl]);

  // Dynamically creating routes based on all the manifest files from static
  // webserver.
  return (
    <Provider theme={appAppearance}>
      <Routes>
        <Route key="-2"
              path="/transcript"
              element={
                <TranscriptPage baseBackendUrl={props.backendUrl}/>
              }>
        </Route>
        {pageConfig.landingPageConfig && authToken ? (
          <>
            <Route
              key="-1"
              path="/"
              element={
                <LandingPage pageConfig={pageConfig.landingPageConfig} />
              }
            />

            {Object.keys(simpleConfig).map((c, i) => {
              return (
                <Route
                  key={i}
                  path={
                    "/" +
                    simpleConfig[c].system +
                    "/" +
                    simpleConfig[c].interface +
                    "/" +
                    simpleConfig[c].businessObject.split("/").pop() +
                    simpleConfig[c].pageType
                  }
                  element={
                    <Page
                      config={simpleConfig[c]}
                      key={1000 + i}
                      authToken={authToken}
                      backendUrl={`${props.backendUrl}/gateway`}
                    />
                  }
                />
              );
            })}
          </>
        ) : (
          <>
            <Route path="/" element={<MSLoader label="Loading..." />} />
          </>
        )}
      </Routes>
    </Provider>
  );
}

export default App;

// Possible values for theme: 'default', 'light', 'dark' and 'contrast'
function initTeamsTheme(theme) {
  switch (theme) {
    case "dark":
      return teamsDarkTheme;
    case "contrast":
      return teamsHighContrastTheme;
    default:
      return teamsTheme;
  }
}
