import { Text, Image, Input, Flex, TextArea } from "@fluentui/react-northstar";
import { Link } from "react-router-dom";
import DropDown from "./DropDown";

/**
 * The Object Property Grid is composed of a grid of individual Object Property
 * Components. Each Object Property contains a label (title) and a value.
 */

const ObjectProperty = (props) => {
  const handleTextChange = (e) => {
    props.handleTextChange(e, props.propertyKey);
  };

  // Function For DropDown
  const handleSelectChange = (selectValue) => {
    props.handleSelectChange(selectValue, props.propertyKey);
  };

  /*
   * "valueElement" is either plaintext, an input field, or a link depending on
   * whether the property is disabled, editable, and whether it has a link.
   */
  let valueElement = <Text size="large" content={props.propertyValue} />;
  if (props.editable && !props.disabled) {
    switch (props.inputType) {
      case "Dropdown":
        let datasourceUrl = `${props.dropdownProps.backendUrl}/${props.dropdownProps.systemName}/${props.dropdownProps.interfaceName}/ValueHelp`;
        valueElement = (
          <DropDown
            pageObject={props.dropdownProps.pageObject}
            datasourceUrl={datasourceUrl}
            selectableField={props.propertyKey}
            defaultValue={props.propertyValue}
            authToken={props.dropdownProps.authToken}
            onChange={handleSelectChange}
          />
        );
        break;
      case "TextInput":
        valueElement = (
          <Input
            onChange={handleTextChange}
            size="large"
            defaultValue={props.propertyValue}
            placeholder={props.placeholder}
            value={props.value}
          />
        );
        break;
      case "TextArea":
        valueElement = (
          <TextArea
            onChange={handleTextChange}
            size="large"
            defaultValue={props.propertyValue}
          />
        );
        break;
      default:
        break;
    }
  } else if (props.type === "Image") {
    // if the target element is an image, then load the image
    valueElement = (
      <Image
        src={process.env.REACT_APP_CONFIG_URL + props.src}
        styles={{ maxWidth: '200px'}}
        alt="Image"
      />
    );
  } else if (
    props.disabled &&
    typeof props.link !== "undefined" &&
    props.link.hasOwnProperty("url")
  ) {
    const url = props.replaceWithConfigState(props.link.url);
    if (props.link.hasOwnProperty("type") && props.link.type === "deep") {
      valueElement = (
        <Link style={{ textDecoration: "none" }} to={`../${url}`}>
          <Text size="large" atMention={true} content={props.propertyValue} />
        </Link>
      );
    } else {
      valueElement = (
        <a
          style={{ textDecoration: "none" }}
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          <Text size="large" atMention={true} content={props.propertyValue} />
        </a>
      );
    }
  }

  return (
    <Flex styles={{ padding: "15px" }} column>
      <Text size="medium" content={props.propertyName} />
      {valueElement}
    </Flex>
  );
};

export default ObjectProperty;
