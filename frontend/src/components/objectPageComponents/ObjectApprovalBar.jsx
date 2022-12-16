import {
  Box,
  Button,
  Flex,
  Segment,
  Text,
  Image,
  FlexItem,
} from "@fluentui/react-northstar";

require("dotenv").config();
const env = process.env;

const ObjectApprovalBar = (props) => {
  const createMessage = (status) => {
    switch (status) {
      case "08":
        return (
          <Flex>
            <Image
              src={env.REACT_APP_CONFIG_URL + "/frontend/images/rejected.png"}
            />
            <Text
              weight="semibold"
              error
              content={" Rejected on " + props.lastChangeDateTime}
              style={{ textAlign: "center" }}
            />
          </Flex>
        );
      case "05":
        return (
          <Flex>
            <Image
              src={env.REACT_APP_CONFIG_URL + "/frontend/images/approved.png"}
            />
            <Text
              weight="semibold"
              success
              content={" Approved on " + props.lastChangeDateTime}
              style={{ textAlign: "center" }}
            />
          </Flex>
        );
      default:
        return <></>;
    }
  };

  return (
    <Box
      styles={{
        position: "sticky",
        bottom: "0",
        height: "fit-content",
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Segment styles={{ width: "100%" }}>
        <Flex
          styles={{
            paddingRight: "16px",
            paddingLeft: "16px",
            width: "100%",
          }}
          gap="gap.small"
          vAlign="center"
          hAlign="end"
        >
          {createMessage(props.status)}
          <FlexItem grow>
            <Box />
          </FlexItem>
          {props.status === "08" || props.status === "05" ? (
            <>
              <>
                <Button onClick={props.handleDiscussClick} content="Discuss" />
                <Button onClick={props.handleCloseClick} content="Close" />
              </>
            </>
          ) : (
            <>
              <>
                <Button onClick={props.handleDiscussClick} content="Discuss" />
                <Button onClick={props.handleRejectClick} content="Reject" />
                <Button
                  onClick={props.handleApproveClick}
                  disabled={props.editing}
                  primary
                  content="Approve"
                />
              </>
            </>
          )}
        </Flex>
      </Segment>
    </Box>
  );
};

export default ObjectApprovalBar;
