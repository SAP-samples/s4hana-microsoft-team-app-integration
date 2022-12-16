import {
  Grid,
  Card,
  Segment,
  Flex,
  Text,
  Loader,
  gridHorizontalBehavior,
  Button,
} from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * Opening the Bridge Framework app from the messaging extension toolbar will
 * always load the landing page first. The landing page contains cards that link
 * to table pages for business objects. The format for the routes to the table
 * pages must always follow as such: "/System/Interface/TablePage". A specific
 * example could be: "/S4HanaCloud/Destination/PurchaseOrderTable".
 */

const LandingPage = (props) => {
  const [formattedData, setFormattedData] = useState([]);

  const formatData = (data) => {
    let formattedDataArr = [];
    for (let item of data.solutions) {
      formattedDataArr.push(
        <div style={{ padding: "15px" }}>
          <div>
            <Card
              fluid
              styles={{
                border: "2px solid #E1DFDD",
                borderRadius: "5px",
              }}
            >
              <Link
                key={item.key}
                style={{ textDecoration: "none" }}
                to={item.path}
              >
                <Flex
                  column
                  hAlign="start"
                  styles={{ paddingTop: "10px", paddingBottom: "10px" }}
                >
                  <Text
                    content={item.header}
                    size="medium"
                    weight="semibold"
                    color="grey"
                  />
                  <Text content={item.description} size="medium" color="grey" />
                </Flex>
              </Link>
            </Card>
          </div>
        </div>
      );
    }
    return formattedDataArr;
  };

  useEffect(() => {
    setFormattedData(formatData(props.pageConfig));
    microsoftTeams.initialize();
  }, [props.pageConfig]);

  const handleSignOutClick = (e) => {
    e.preventDefault();
    console.log("signing out...");
    microsoftTeams.tasks.submitTask({
      signOut: true,
    });
  };

  const gridStyles = {
    gridTemplateColumns: `repeat(auto-fit,minmax(max(250px,${
      (1 / 3) * 100
    }%), 1fr))`,
    padding: "30px",
  };

  return (
    <Flex column styles={{ minHeight: "100vh" }}>
      {formattedData ? (
        <div style={{ flex: "1" }}>
          <Grid
            accessibility={gridHorizontalBehavior}
            columns="2"
            styles={gridStyles}
            content={formattedData}
          />
        </div>
      ) : (
        <Loader label="Loading..." />
      )}
      <Flex
        styles={{
          position: "sticky",
          bottom: "0",
          boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
        }}
        hAlign="center"
      >
        <Segment styles={{ width: "100%" }}>
          <Flex hAlign="center">
            <Button
              onClick={handleSignOutClick}
              text
              secondary
              styles={{ align: "center" }}
              content={
                <Flex gap="gap.smaller">
                  <Text weight="regular" content="Click here to" />
                  <Text color="brand" content="Sign Out" />{" "}
                </Flex>
              }
            />
          </Flex>
        </Segment>
      </Flex>
    </Flex>
  );
};

export default LandingPage;
