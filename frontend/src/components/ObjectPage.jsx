import {
  Alert,
  Flex,
  Box,
  FlexItem,
  Text,
  Divider,
} from "@fluentui/react-northstar";
import Header from "./Header";
import Loader from "./Loader";
import { useEffect, useRef, useState, useCallback} from "react";
import { useLocation } from "react-router-dom";
import * as helper from "./helpers";
import ObjectPropertyGrid from "./objectPageComponents/ObjectPropertyGrid";
import ObjectButtonBar from "./objectPageComponents/ObjectButtonBar";
import ObjectApprovalBar from "./objectPageComponents/ObjectApprovalBar";
import * as microsoftTeams from "@microsoft/teams-js";
import Table from "./Table";
import Button from "./Button";
import Image from "./Image";

/**
 * The Object Page is a type of page that contains details about one particular
 * instance of a business object from an SAP system (such as S/4HANA). The
 * Object page currently supports two different components: Object Property Grid
 * and Table.
 */

const ObjectPage = (props) => {
  const currentUrl = new URL(window.location.href);
  const searchParams = currentUrl.searchParams;
  const location = useLocation();

  /**
   * Dependent objects, such as Purchase Order Item, are defined in the
   * configuration files with a reference to their parent object. In the case of
   * Purchase Order Item, it is defined as "PurchaseOrder/PurchaseOrderItem". In
   * this file, businessObject would refer to "PurchaseOrderItem" instead of
   * "PurchaseOrder/PurchaseOrderItem".
   */
  const businessObject = props.config.businessObject.split("/").pop();
  const objectID = searchParams.get(businessObject);
  const [propertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const editable = useRef(false);
  const propertyGrid = useRef(null);
  const editedValues = useRef({});
  const [errorMessage, setErrorMessage] = useState("");

  const [lastChangeDateTime, setLastChangeDateTime] = useState("");
  const [status, setStatus] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const dropdownProps = {

    pageObject: props.config.businessObject,
    backendUrl: props.backendUrl,
    systemName: props.config.system,
    interfaceName: props.config.interface,
    authToken: props.authToken
  }

  const paramPathArray = [];
  props.config.businessObject.split("/").forEach((obj) => {
    paramPathArray.push(obj);
    if (searchParams.has(obj)) {
      paramPathArray.push(searchParams.get(obj));
    }
  });

  const reqQuery = {};
  if(location.state){
    if(location.state.hasOwnProperty("kvPairs") && location.state.kvPairs !== null){
      for(let i = 0; i < location.state.kvPairs.length; i++){
        const kvPair = location.state.kvPairs[i];
        reqQuery[kvPair[0]] = kvPair[1];
      }
    }
  }

  const req =
    props.backendUrl +
    "/" +
    props.config.system +
    "/" +
    props.config.interface +
    "/" +
    paramPathArray.join("/");
  

  const updatePropertyListWithValues = useCallback(() => {
    const propertyGridComponent = props.config.components.find(
      (component) => component.type === "PropertyGrid"
    );
    if (propertyGridComponent) {
      const properties = propertyGridComponent.properties;

      helper
        .getData(req, props.authToken, reqQuery)
        .then((data) => {
          const propertyListCopy = JSON.parse(JSON.stringify(properties));
          propertyListCopy.forEach((property) => {
            if(property.hasOwnProperty("inputType") && property.inputType !== ""){
              editable.current = true;
            }
            if (data.hasOwnProperty(property.key)) {
              if (helper.isDate(data[property.key])) {
                property.value = helper.formatDate(
                  JSON.parse(JSON.stringify(data[property.key]))
                );
              } else {
                property.value = JSON.parse(JSON.stringify(data[property.key]));
                props.updateConfigState(property.key, property.value);
              }
            }

            // Setting creation date
            if (data.hasOwnProperty(data[props.config.CreationDate])) {
              const date = helper.formatDate(
                JSON.parse(JSON.stringify(data[props.config.CreationDate]))
              );
              setCreationDate(date);
            }

            // Date on which order was last changed, including status changes
            if (data.hasOwnProperty(data[props.config.LastChangeDateTime])) {
              const date = helper.formatDate(
                JSON.stringify(data[props.config.LastChangeDateTime])
              );
              setLastChangeDateTime(date);
            }

            // Status whether order is approved, rejected, or pending
            if (data.hasOwnProperty(data[props.config.PurchasingProcessingStatus])) {
              setStatus(data[props.config.PurchasingProcessingStatus]);
            }
          });
          setPropertyList(propertyListCopy);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    microsoftTeams.initialize();
    updatePropertyListWithValues();
  }, [updatePropertyListWithValues]);

  const scrollToPropertyGrid = () => propertyGrid.current.scrollIntoView();

  const handleTextChange = (e, propertyKey) => {
    editedValues.current[propertyKey] = e.target.value;
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    scrollToPropertyGrid();
    setEditing(true);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (Object.keys(editedValues.current).length > 0) {
      setLoading(true);
      helper
        .updateData(req, editedValues.current, reqQuery, props.authToken)
        .then((response) => {
          if (
            response.hasOwnProperty("data") &&
            !(response.status >= 200 && response.status <= 299)
          ) {
            if (response["data"] === "" || response["data"].length === 0) {
              setErrorMessage("An unspecified error has occurred.");
            } else {
              if (typeof response["data"] === "string") {
                // error box will not new line
                setErrorMessage(response["data"].replace("\n", " and "));
              } else {
                setErrorMessage(response["data"].value);
              }
            }
            editedValues.current = {};
            setEditing(true);
          } else {
            setErrorMessage("");
            setEditing(false);
            editedValues.current = {};
          }
          updatePropertyListWithValues();
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } else {
      setErrorMessage("No changes have been made.");
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    if (editing) {
      setErrorMessage("");
      editedValues.current = {};
      setEditing(false);
    } else {
      microsoftTeams.tasks.submitTask({
        title: "",
        objData: {},
        url: window.location.href,
      });
    }
  };

  const handleExportClick = (e) => {
    e.preventDefault();
    const objData = {};
    propertyList.forEach((property) => {
      objData[property.content] = property.value;
    });
    microsoftTeams.tasks.submitTask({
      title: `${props.config.title} ${objectID}`,
      objData: objData,
      url: window.location.href,
    });
  };

  // Function For DropDown
  const handleSelectChange = (selectValue, propertyKey) => {
    editedValues.current[propertyKey] = selectValue;
  }

  // need to generalize query params
  const [workflowType, setWorkflowType] = useState("");

  const [businessObjectState, setBusinessObjectState] = useState("");
  const [taskType, setTaskType] = useState("");
  const [replyToId, setReplyToId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [dataStore, setDataStore] = useState({});

  useEffect(() => {
    if (props.authToken) {
      // parsing query params
      let params = new URLSearchParams(window.location.search);

      setWorkflowType(params.has("ActionId") ? "approval" : "");
      const objectName = params.has("BusinessObjectName")
        ? params.get("BusinessObjectName")
        : "";
      params.delete("BusinessObjectName");
      const task = params.has("ActionId") ? params.get("ActionId") : "";
      params.delete("ActionId");
      const taskType = params.has("taskType") ? params.get("taskType") : "";
      params.delete("taskType");
      const replyId = params.has("replyToId") ? params.get("replyToId") : "";
      params.delete("replyToId");

      let data = {};
      // NOTE: duplicate keys will get rewritten!
      for (const entry of params.entries()) {
        const key = entry[0];
        const value = entry[1];
        data[key] = value;
      }
      console.log("data store: ", data);

      data["CREATED_ON"] = creationDate;

      // setting query params
      setBusinessObjectState(objectName);
      setTaskType(taskType);
      setReplyToId(replyId);
      setTaskId(task);
      setDataStore(data);

      updatePropertyListWithValues();
    }
  }, [props.authToken, updatePropertyListWithValues]);

  // will only be called if a taskId exists (accept/reject workflow)
  // other workFlows call MS teams directly in their respective btn handler
  const submitTask = async (
    status,
    objData = {},
    title = "",
    url = "",
    approvalStatus = ""
  ) => {
    try {
      setLoading(true);
      let payload = {
        decisionKey: approvalStatus,
        workFlowId: taskId,
      };

      if (status !== "close" && status !== "discuss") {
        const url = `${req}?review=true`;
        await helper.submitData(url, payload, props.authToken);
        window.location.reload(true);
      }

      // if any of the other params exist and need to be passed on
      // they will need to be added them to the data store
      let data = dataStore;
      data["BusinessObjectName"] = businessObjectState; // PO, SO, etc.
      if (url.length) {
        data["URL"] = url;
      }
      if (title.length) {
        data["TITLE"] = title;
      }
      if (Object.keys(objData).length) {
        data["OBJECT"] = objData;
      }
      if (approvalStatus.length) {
        data["ApprovalStatus"] = approvalStatus; // binary choice of 0001 or 0002
      }
      setDataStore(data);
      console.log("data store before submit task: ", dataStore);

      // submit teams task
      microsoftTeams.tasks.submitTask({
        clientToken: props.authToken,
        taskType: taskType,
        taskAction: status, // not business object error status, but rather approve/reject/close
        replyToId: replyToId,
        dataStore: dataStore,
      });
      setLoading(false);
    } catch (error) {
      console.log("ERROR while updating workflow: ", error);
    }
  };

  // handleApproveClick, handleRejectClick, handleCloseClick, handleDiscussClick
  // are all part of the approval workflow
  const handleApproveClick = (e) => {
    e.preventDefault();
    const url = window.location.href;
    const approvalStatus = "0001";
    submitTask("approve", {}, "", url, approvalStatus);
  };

  const handleRejectClick = (e) => {
    e.preventDefault();
    const url = window.location.href;
    const approvalStatus = "0002";
    submitTask("reject", {}, "", url, approvalStatus);
  };

  // this is where close click is involved... maybe for the message pop up?
  // seems like it will close the task module and option exists b/c the PO
  // is already accepted/rejected
  const handleCloseClick = (e) => {
    e.preventDefault();
    const url = window.location.href;
    submitTask("close", {}, "", url);
  };

  // sends to forward email field from payload stored in url
  const handleDiscussClick = (e) => {
    e.preventDefault();

    const objData = {};
    propertyList.forEach((property) => {
      if (property.value !== undefined) {
        objData[property.content] = property.value;
      }
    });

    const title = `${props.config.title} ${objectID}`;
    const url = window.location.href;

    submitTask("discuss", objData, title, url);
  };

  const componentList = [];

  props.config.components.forEach((component) => {

    switch (component.type) {
      case "PropertyGrid":
        componentList.push(
          <ObjectPropertyGrid
            handleTextChange={handleTextChange}
            propertyList={propertyList}
            disabled={!editing}
            refProp={propertyGrid}
            replaceWithConfigState={props.replaceWithConfigState}
            /* Props For DropDown*/
            dropdownProps={dropdownProps}
            handleSelectChange={handleSelectChange}
            /* Props For DropDown*/
          />
        );
        break;
      case "Table":
        componentList.push(
          <Table
            backendUrl={props.backendUrl}
            table={component}
            pageObject={props.config.businessObject}
            config={props.config}
            authToken={props.authToken}
          />
        );
        break;
      case "Button":
        componentList.push(
          <Button
            content={component.content}
            action={component.action}
            replaceWithConfigState={props.replaceWithConfigState}
          />
        );
        break;
      case "Image":
        componentList.push(
          <Image 
            title={component.title}
            src={component.src}/>
        );
        break;
      default:
        componentList.push(
          <Text content="No component of that type exists." />
        );
        break;
    }
    componentList.push(<Divider />);
  });

  componentList.pop();

  // Creating and obtaining the header reference to get loading margin value
  const ref = useRef(null);
  const [marginHeight, setMarginHeight] = useState(0);
  useEffect(() => {
    ref.current?.focus();
    setMarginHeight(ref.current.clientHeight);
  }, []);

  const ObjectType = ({ workflowType }) => {
    switch (workflowType) {
      case "approval":
        return (
          <ObjectApprovalBar
            handleApproveClick={handleApproveClick}
            handleRejectClick={handleRejectClick}
            handleCloseClick={handleCloseClick}
            handleDiscussClick={handleDiscussClick}
            status={status}
            lastChangeDateTime={lastChangeDateTime}
          />
        );
      default:
        return (
          <ObjectButtonBar
            editing={editing}
            editable={editable.current}
            handleEditClick={handleEditClick}
            handleSaveClick={handleSaveClick}
            handleCancelClick={handleCancelClick}
            handleExportClick={handleExportClick}
          />
        );
    }
  };

  return (
    <Flex column styles={{ minHeight: "100vh" }}>
      <Header title={`${props.config.title} ${objectID}`} ref={ref} />
      {(
        <>
          {loading ? (
            <Loader headerHeight={marginHeight} />
          ) : (
            <>
              {errorMessage !== "" && <Alert danger content={errorMessage} />}
              {componentList}
              <FlexItem grow>
                <Box />
              </FlexItem>
              <ObjectType workflowType={workflowType} />
            </>
          )}
        </>
      )}
    </Flex>
  );
};

export default ObjectPage;
