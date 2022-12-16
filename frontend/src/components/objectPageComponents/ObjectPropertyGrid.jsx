import { Box, Grid } from "@fluentui/react-northstar";
import ObjectProperty from "./ObjectProperty";

/**
 * The Object Property Grid only appears on object pages. It displays the labels
 * (titles) and values of the properties specified in the object page's
 * configuration file.
 */

const ObjectPropertyGrid = (props) => {
  const objectPropertyList = [];
  props.propertyList.forEach((property) => {
    const objectProperty = (
      <ObjectProperty
        propertyName={property.content}
        propertyValue={property.value}
        disabled={props.disabled}
        propertyKey={property.key}
        key={property.key}
        editable={property.hasOwnProperty("inputType") && property.inputType !== ""}
        link={property.link}
        handleTextChange={props.handleTextChange}
        replaceWithConfigState={props.replaceWithConfigState}
        /* Props For DropDown*/
        dropdownProps = {props.dropdownProps}
        inputType = {property.inputType}
        handleSelectChange = {props.handleSelectChange}
        /* Props For DropDown*/
        /* Props for Image*/
        src={property.src}
        type={property.type}
        placeholder={property.placeholder}
        value={property.value}
      />
    );
    if (!property.hidden) {
      objectPropertyList.push(objectProperty);
    }
  });

  const gridStyles = {
    gridTemplateColumns: `repeat(auto-fit,minmax(max(250px,${
      (1 / 3) * 100
    }%), 1fr))`,
    padding: "30px",
  };

  return (
    <Box styles={{ align: "center" }}>
      {/**
       * A div must be used as a container for the property grid
       * in order to be a target for scrolling upon an edit click
       */}
      <div ref={props.refProp}>
        <Grid styles={gridStyles} content={objectPropertyList} />
      </div>
    </Box>
  );
};

export default ObjectPropertyGrid;
