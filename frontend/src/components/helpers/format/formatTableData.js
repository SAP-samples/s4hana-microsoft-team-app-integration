import * as helper from "..";
import { Image } from "@fluentui/react-northstar";

export const formatTableData = (data, headerItems, tableObject) => {
    const tableDatas = [];
    for (let i = 0; i < data[0].values.d.results.length; i++) {
      const items = [];
      const tableData = {};
      // searchparam lowercase to follow convention for custom attributes in DOM
      let searchparam = "";
      for (let j = 0; j < headerItems.length; j++) {
        if (
          headerItems[j].key in data[0].values.d.results[i] ||
          headerItems[j].type === "Image" ||
          headerItems[j].type === "ImageMap"
        ) {
          let rowData = {};
          rowData["key"] = (i + 1).toString() + "-" + (j + 1).toString();
          // type of the image can either be a uniform image 
          // or a map of images that can display two status an item
          if (headerItems[j].type === "Image") {
            rowData["content"] = (
              <Image
                styles={{ maxWidth: "50px" }}
                src={process.env.REACT_APP_CONFIG_URL + headerItems[j].src}
              />
            );
          } else if (headerItems[j].type === "ImageMap") {
            let headerItemsKey = headerItems[j].mappings[0].key;
            for (let k = 0; k < headerItems[j].mappings.length; k++) {
              if (
                data[0].values.d.results[i][headerItemsKey] ===
                headerItems[j].mappings[k].status
              ) {
                rowData["content"] = (
                  <Image
                    styles={{ maxWidth: 200, maxHeight: 30 }}
                    src={
                      process.env.REACT_APP_CONFIG_URL +
                      headerItems[j].mappings[k].src
                    }
                  />
                );
                break;
              }
            }
          } else {
            let headerItemsKey = headerItems[j].key;
            let contentValue =
              data[0].values.d.results[i][headerItemsKey].toString();
            if (helper.isDate(contentValue)) {
              rowData["content"] = helper.formatDate(contentValue);
            } else {
              rowData["content"] = data[0].values.d.results[i][headerItemsKey];
            }
            if (
              tableObject in data[0].values.d.results[i]
            ) {
              searchparam = data[0].values.d.results[i][tableObject];
            }
          }
          items.push(rowData);
        }
      }
      tableData["key"] = i + 1;
      tableData.items = items;
      tableData.searchparam = searchparam;
      tableDatas.push(tableData);
    }
    return tableDatas;
  };