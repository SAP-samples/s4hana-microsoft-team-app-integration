import React from "react";
import { Box, Header, Image as MSImage } from "@fluentui/react-northstar";

/**
 * The Image component can appear either as the singular component on an object page,
 * or alongside other components on an object grid or an object table
 * page.
 */

const Image = (props) => {
  return (
    <Box styles={{ padding: "30px" }}>
      {props.title && (
        <Header
          styles={{ paddingLeft: "10px" }}
          as="h3"
          content={props.title}
        />
      )}
      {props.src.indexOf("https") !== -1 && (
        // image source can be from the external url
        <MSImage
          style={{ padding: "10px", maxWidth: "200px" }}
          src={props.src}
        />
      )}
      {props.src.indexOf("https") === -1 && (
        // image is loaded from the config server
        <MSImage
          style={{ padding: "10px" }}
          styles={{ maxWidth: "200px" }}
          src={process.env.REACT_APP_CONFIG_URL + props.src}
        />
      )}
    </Box>
  );
};

export default Image;
