import { Box } from "@fluentui/react-northstar";
import Table from "./Table";
import Header from "./Header";
import { useRef, useEffect, useState } from "react";

/**
 * Simple page that only currently supports the Table component.
 */

const TablePage = (props) => {
  // Creating and obtaining the header reference to get loading margin value
  const ref = useRef(null);
  const [marginHeight, setMarginHeight] = useState(0);
  useEffect(() => {
    ref.current?.focus();
    setMarginHeight(ref.current.clientHeight);
  }, []);

  const componentList = [];

  props.config.components.forEach((component) => {
    switch (component.type) {
      case "Table":
        componentList.push(
          <Table
            backendUrl={props.backendUrl}
            table={component}
            authToken={props.authToken}
            config={props.config}
            headerHeight={marginHeight}
          />
        );
        break;

      default:
        break;
    }
  });

  return (
    <Box>
      <Header title={props.config.title} ref={ref} />
      {componentList}
    </Box>
  );
};

export default TablePage;
