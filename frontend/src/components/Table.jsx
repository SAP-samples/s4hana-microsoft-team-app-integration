import {
  Table as MSTable,
  Box,
  Text,
  Input,
  SearchIcon,
  Header,
  Loader as MSLoader,
  gridCellBehavior,
  gridHeaderCellBehavior,
  gridNestedBehavior,
  gridRowBehavior,
} from "@fluentui/react-northstar";
import { AutoSizer, List as ReactVirtualizedList } from 'react-virtualized'
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as helper from "./helpers";
import Loader from "./Loader";

/**
 * The Table component can appear either as the singular component on both a
 * table page and an object page, or alongside other components on an object
 * page. The table component can have a title, can have clickable (interactive)
 * rows, can display a specified max number of rows, and can include a searchbar
 * if properly configured.
 */

const Table = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formattedData, setFormattedData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const businessObject = useRef(props.table.businessObject.split("/").pop());
  const interactive = useRef(false);
  const maxItems = useRef(50);
  const searchable = useRef(false);
  const navigate = useNavigate();
  const req = useRef("");
  const pathParamsRef = useRef([]);

  const currentUrl = new URL(window.location.href);
  const searchParams = currentUrl.searchParams;

  const populateTable = useCallback(
    (url) => {
      setLoading(true);
      helper
        .getData(url, props.authToken)
        .then((data) => {
          const tableDatas = helper.formatTableData(
            data,
            props.table.columns,
            businessObject.current
          );
          if (interactive.current) {
            tableDatas.forEach((item, i) => {

              let tableLinkParams = new URL(window.location.href).searchParams;
              tableDatas[i].onClick = () => {
                tableLinkParams.set(
                  businessObject.current,
                  tableDatas[i].searchparam
                );

                /* Send [[pathParamName, value]] key-value pairs along with navigate 
                 * in-case of original system api needs multiple path parameters
                 */
                let kvPairs = [];
                if (pathParamsRef.current != null && pathParamsRef.current.length > 0) {

                  let rowData = tableDatas[i];
                  for (let j = 0; j < pathParamsRef.current.length; j++) {

                    let kvPair = [];
                    kvPair.push(pathParamsRef.current[j][1]);
                    kvPair.push(rowData.items[pathParamsRef.current[j][0]].content);
                    kvPairs.push(kvPair);
                  }
                }

                /**
                 * "Object" is added after the businessObject because all paths
                 * to an object page end in "Object", for example:
                 * "/PurchaseOrderObject" or "/SalesOrderObject"
                 */
                navigate(
                  "../" +
                  props.table.system +
                  "/" +
                  props.table.interface +
                  "/" +
                  businessObject.current +
                  "Object?" +
                  tableLinkParams.toString(), { state: { kvPairs: kvPairs } }
                );
              };
            });
          }
          setFormattedData(tableDatas);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    },
    [navigate]
  );

  useEffect(() => {
    if (originalData.length === 0) {
      setOriginalData(formattedData);
    }
  }, [formattedData]);

  useEffect(() => {
    interactive.current = props.table.hasOwnProperty("interactive")
      ? props.table.interactive
      : false;

    maxItems.current = props.table.hasOwnProperty("maxItems")
      ? props.table.maxItems
      : 50;

    searchable.current = props.table.hasOwnProperty("searchable")
      ? props.table.searchable
      : false;

    const paramPathArray = [];
    props.table.businessObject.split("/").forEach((obj) => {
      paramPathArray.push(obj);
      if (searchParams.has(obj)) {
        paramPathArray.push(searchParams.get(obj));
      }
    });

    // Store [index, pathParamName] pair in case of multiple path params need for API call
    let index = 0;
    let paramIndexPairs = [];
    if (props.table.hasOwnProperty("keys") && props.table.keys.length > 0) {

      props.table.columns.forEach((column) => {

        if (props.table.keys.includes(column.key)) {
          let paramIndexPair = [];
          paramIndexPair.push(index++);
          paramIndexPair.push(column.key);
          paramIndexPairs.push(paramIndexPair);
        }
      });
      pathParamsRef.current = paramIndexPairs;
    }

    req.current =
      props.backendUrl +
      "/" +
      props.table.system +
      "/" +
      props.table.interface +
      "/" +
      paramPathArray.join("/") +
      /*
      "?top=" +
      maxItems.current +
      */
      "?&filter=";

    populateTable(req.current);
  }, [populateTable]);

  const handleTextChange = (e) => {
    e.preventDefault();
    const value = e.target.value ? e.target.value : "";
    console.log("Search query: ", searchQuery);
    setSearchQuery(value);
    // Get all the data on clicking (X) button on the searchbox
    if (typeof e.target.value === "undefined") {
      // Getting data based on empty string
      populateTable(req.current);
    }

    if (value.length === 0) {
      setFormattedData(originalData);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log("Searching...");
      e.preventDefault();
      const p = searchQuery ? searchQuery : "";
      const query = p;
      populateTable(req.current + query);
    }
  };

  const centering = (index) => {
    return props.table.columns[index].align;
  };

  const rowRenderer = ({ index, style }) => {
    const row = formattedData[index]
    return (
      <MSTable.Row
        style={style}
        key={row.key}
        accessibility={gridRowBehavior}
        aria-rowindex={index + 1}
        onClick={() => row.onClick()}
      >
        {row.items.map((item, idx) => (
          <MSTable.Cell {...item} accessibility={gridCellBehavior} style={{ justifyContent: centering(idx) }} />
        ))}
      </MSTable.Row>
    )
  }

  const accessibilityListProperties = {
    'aria-label': '',
    'aria-readonly': undefined
  };

  return (
    <Box styles={{ padding: "30px" }}>
      {props.table.title && (
        <Header
          styles={{ paddingLeft: "10px" }}
          as="h3"
          content={props.table.title}
        />
      )}
      {props.table.searchable && (
        <Box styles={{ paddingBottom: "15px" }}>
          <Input
            fluid
            placeholder={"Search..."}
            onChange={handleTextChange}
            clearable
            onKeyUp={handleSearch}
            icon={<SearchIcon />}
          />
        </Box>
      )}

      <AutoSizer disableHeight>
        {({ width }) => (
          <MSTable aria-label="Nested nagivation" accessibility={gridNestedBehavior} aria-rowcount={formattedData.length}>

            <MSTable.Row header accessibility={gridRowBehavior} style={{ width }}>
              {props.table.columns.map((item) => (
                <MSTable.Cell
                  content={item.content}
                  style={{ fontSize: "0.875rem", fontWeight: "600" }}
                  accessibility={gridHeaderCellBehavior}
                />
              ))}
            </MSTable.Row>

            <ReactVirtualizedList
              disableHeader
              height={400}
              rowCount={formattedData.length}
              width={width}
              rowHeight={80}
              rowRenderer={rowRenderer}
              overscanRowCount={5}
              {...accessibilityListProperties}
            />
          </MSTable>
        )}
      </AutoSizer>

      {formattedData.length === 0 && !loading && (
        <Text
          styles={{ padding: "10px" }}
          size="medium"
          content="No items found."
        />
      )}
      {formattedData.length > 0 && !loading && searchable.current && (
        <Text
          styles={{ padding: "10px" }}
          size="medium"
          content={
            formattedData.length + " item(s) displayed, search to view more..."
          }
        />
      )}

      {/**
       * The loading behavior is different on object pages vs on table pages.
       * On a table page the loader will occupy the entire task module, whereas on
       * an object page the loader will be localized to the table.
       */}
      {loading && !props.pageObject && (
        <Loader headerHeight={props.headerHeight} />
      )}
      {loading && props.pageObject && <MSLoader size="small" />}
    </Box>
  );
};

export default Table;