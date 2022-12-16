import { Alert, Flex, Box, FlexItem, Segment, Button } from "@fluentui/react-northstar";
import Header from "./Header";
import Loader from "./Loader";
import { useEffect, useRef, useState } from "react";
import * as helper from "./helpers";
import ObjectPropertyGrid from "./objectPageComponents/ObjectPropertyGrid";
import * as microsoftTeams from "@microsoft/teams-js";

const FormPage = (props) => {
  const [loading, setLoading] = useState(true);

  // Form state
  const [propertyList, setPropertyList] = useState([]);
  const editedValues = useRef({});
  const [isCreateButtonDisabled, setCreateButtonDisabled] = useState(false);

  // Message state
  const [message, setMessage] = useState("");
  const [isMessageSuccess, setMessageSuccess] = useState(false);
  const [isMessageDanger, setMessageDanger] = useState(false);

  const dropdownProps = {
    pageObject: props.config.businessObject,
    backendUrl: props.backendUrl,
    systemName: props.config.system,
    interfaceName: props.config.interface,
    authToken: props.authToken
  }

  const header = useRef(null);
  const [marginHeight, setMarginHeight] = useState(0);
  useEffect(() => {
    header.current?.focus();
    setMarginHeight(header.current.clientHeight);
    microsoftTeams.initialize();
  }, []);

  useEffect(() => {
    const propertyListCopy = JSON.parse(JSON.stringify(props.config.properties));
    setPropertyList(propertyListCopy);
    setLoading(false);
  }, [props.config.properties]);

  const handleTextChange = (e, propertyKey) => {
    if (e.target.value) {
      editedValues.current[propertyKey] = e.target.value;
    } else {
      delete editedValues.current[propertyKey];
    }
  };

  const handleCreateClick = (e) => {
    e.preventDefault();
    if (Object.keys(editedValues.current).length > 0) {
      setLoading(true);

      const url = `${props.backendUrl}/${props.config.system}/${props.config.interface}/${props.config.businessObject}`;
      helper.submitData(url, editedValues.current, props.authToken).then((response) => {
        return new Promise((resolve, reject) => {
          if (response.status >= 200 && response.status <= 299) {
            resolve(response.data.d);
          } else {
            reject(`Status ${response.status} error. ${response.statusText}`);
          }
        });
      }).then((d) => {
        // Fill out properties as disabled text
        propertyList.forEach((property) => {
          property.inputType = null;
          property.placeholder = null;
          property.value = d[property.key];
        });

        // Prevent to create again
        setCreateButtonDisabled(true);

        // Show message
        setMessageSuccess(true);
        setMessageDanger(false);
        setMessage("Created successfully.");
      }).catch((error) => {
        console.error(error);
        setMessageSuccess(false);
        setMessageDanger(true);
        setMessage("Error occurred.");
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setMessageSuccess(false);
      setMessageDanger(true);
      setMessage("No changes have been made.");
    }
  };

  const handleCancelClick = (e) => {
    // Reload properties from config
    const propertyListCopy = JSON.parse(JSON.stringify(props.config.properties));
    setPropertyList(propertyListCopy);

    // Reset values
    propertyList.forEach((property) => {
      property.value = null;
    });

    // Reset editedValues
    editedValues.current = {};

    // Enable create button
    setCreateButtonDisabled(false);

    // Show message
    setMessageSuccess(true);
    setMessageDanger(false);
    setMessage("All values are cleared.");
  };

  // Function For DropDown
  const handleSelectChange = (selectValue, propertyKey) => {
    editedValues.current[propertyKey] = selectValue;
  }

  // Creating and obtaining the header reference to get loading margin value
  return (
    <Flex column styles={{ minHeight: "100vh" }}>
      <Header title={`${props.config.title}`} ref={header} />
      {loading ? (
        <Loader headerHeight={marginHeight} />
      ) : (
        <>
          {message !== "" && <Alert content={message} success={isMessageSuccess} danger={isMessageDanger} />}

          <ObjectPropertyGrid
            key="1"
            handleTextChange={handleTextChange}
            propertyList={propertyList}
            disabled={false}
            replaceWithConfigState={props.replaceWithConfigState}
            dropdownProps={dropdownProps}
            handleSelectChange={handleSelectChange}
          />

          <FlexItem grow>
            <Box />
          </FlexItem>
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
                <Button
                  onClick={handleCreateClick}
                  primary
                  content="Create"
                  disabled={isCreateButtonDisabled}
                />
                <Button
                  onClick={handleCancelClick}
                  content="Cancel"
                />
              </Flex>
            </Segment>
          </Box>
        </>
      )}
    </Flex>
  );
};

export default FormPage;