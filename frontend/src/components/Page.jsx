import TablePage from "./TablePage";
import ObjectPage from "./ObjectPage";
import FormPage from "./FormPage";
import { useRef } from "react";

/**
 * The Page component is a parent component for the two types of currently
 * supported pages: Table Page and Object Page.
 */

const Page = (props) => {
  /**
   * Ref that stores anything with a key field as a value for use elsewhere in
   * the config file.
   */

  const configState = useRef({});

  /**
   * Callback function that is passed to children to update the values of any
   * properties that the user might use elsewhere in the config file.
   */

  const updateConfigState = (stateKey, newVal) => {
    configState.current[stateKey] = newVal;
  };

  /**
   * Replaces a string that includes brackets with a value from the page. For
   * example, on the object page for a Purchase Order, using {PurchaseOrder} in
   * the params for a link or in the url for a button will result in the
   * Purchase Order ID replacing {PurchaseOrder}.
   */

  const replaceWithConfigState = (str) => {
    const splitStr = str.split(/([{}])/);
    let finalStr = [];
    for (let index = 0; index < splitStr.length; index++) {
      if (splitStr[index] === "{") {
        finalStr.push(configState.current[splitStr[index + 1]]);
        index += 2;
      } else {
        finalStr.push(splitStr[index]);
      }
    }
    finalStr = finalStr.join("");
    return finalStr;
  };

  switch (props.config.pageType) {
    case "Table":
      return (
        <TablePage
          backendUrl={props.backendUrl}
          config={props.config}
          updateConfigState={updateConfigState}
          replaceWithConfigState={replaceWithConfigState}
          authToken={props.authToken}
        />
      );
    case "Object":
      return (
        <ObjectPage
          backendUrl={props.backendUrl}
          config={props.config}
          updateConfigState={updateConfigState}
          replaceWithConfigState={replaceWithConfigState}
          authToken={props.authToken}
        />
      );
    case "Form":
      return (
        <FormPage
          backendUrl={props.backendUrl}
          config={props.config}
          replaceWithConfigState={replaceWithConfigState}
          authToken={props.authToken}
        />
      );
    default:
      return <h1>There is no page of type {props.config.pageType}.</h1>;
  }
};

export default Page;
