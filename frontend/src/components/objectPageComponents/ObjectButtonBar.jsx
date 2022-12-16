import { Box, Button, Flex, Segment } from "@fluentui/react-northstar";

/**
 * This component displays the save, edit, cancel, and export buttons. Which
 * buttons are displayed depends upon whether the component is being edited or
 * not. If none of the properties on an object are "editable" then only the
 * export button will be displayed.
 */

const ObjectButtonBar = (props) => {
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
        <Flex gap="gap.small" hAlign="end">
          {props.editable ? (
            <Flex
              styles={{
                paddingRight: "16px",
              }}
              gap="gap.small"
            >
              <Button onClick={props.handleCancelClick} text content="Cancel" />
              {props.editing ? (
                <Button onClick={props.handleSaveClick} content="Save" />
              ) : (
                <Button onClick={props.handleEditClick} content="Edit" />
              )}
              <Button
                onClick={props.handleExportClick}
                disabled={props.editing}
                primary
                content="Export"
              />
            </Flex>
          ) : (
            <Flex gap="gap.small">
              <Button
                onClick={props.handleExportClick}
                primary
                content="Export"
              />
            </Flex>
          )}
        </Flex>
      </Segment>
    </Box>
  );
};

export default ObjectButtonBar;
