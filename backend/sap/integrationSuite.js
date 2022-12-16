const axios = require("axios");
const OnPremIntegrationSuiteAuthRouter = require("../router/S4HanaOnPrem/OnPremIntegrationSuiteAuthRouter");

class IntegrationSuite {
  constructIFlowKeysCollection(interfaceMapping, paramPathArray) {
    const iFlowKeys = [];
    for (let i = 0; i < paramPathArray.length - 1; i += 2) {
      let obj = paramPathArray[i];
      interfaceMapping[obj].iFlowKeys.forEach((iFlowKey) => {
        iFlowKeys.push(iFlowKey);
      });
    }
    return iFlowKeys;
  }

  constructIFlowKeysSingleObject(interfaceMapping, paramPathArray) {
    const iFlowKeys = [];
    for (let i = 0; i < paramPathArray.length; i += 2) {
      let obj = paramPathArray[i];
      interfaceMapping[obj].iFlowKeys.forEach((iFlowKey) => {
        iFlowKeys.push(iFlowKey);
      });
    }

    return iFlowKeys;
  }

  searchObject(paramPathArray, query, interfaceMapping, commonConfig) {
    return new Promise((resolve, reject) => {
      //step 1: get the iFlow Keys and objectMapping
      let businessObject = paramPathArray[paramPathArray.length - 1];
      let objectMapping = interfaceMapping[businessObject];
      const iFlowKeys = this.constructIFlowKeysCollection(
        interfaceMapping,
        paramPathArray
      );
      const jsonBody = {
        top: query.top ? query.top : process.env.REACT_APP_SCROLL_PAGE_SIZE
      };
      // step 2: construct the filter if applicable
      if (objectMapping.searchFields) {
        const filters = [];
        objectMapping.searchFields.forEach((field) => {
          field = field.trim();
          if (query["filter"]) {
            filters.push(
              "substringof('" + query["filter"] + "'," + field + ") eq true"
            );
          } else {
            filters.push(`substringof('` + "" + `',` + field + `) eq true`);
          }
        });

        jsonBody.filter = filters.join(" or ");
      }

      //step 3: assign key-value pairs for the iFlow Keys and their corresponding values
      if (iFlowKeys.length > 0) {
        // for each object including the current object, construct an array of the values to correspond to the iFlowKeys
        const iFlowKeyValues = [];
        for (let i = 1; i < paramPathArray.length; i += 2) {
          let keyValues = paramPathArray[i];
          keyValues.split("+").forEach((keyValue) => {
            iFlowKeyValues.push(keyValue);
          });
        }

        //add all iFlowKey-value pairs to the json body
        for (let i = 0; i < iFlowKeys.length; i++) {
          jsonBody[iFlowKeys[i]] = iFlowKeyValues[i];
        }
      }

      axios
        .post(
          commonConfig.iFlowUrl + objectMapping.searchUrl,
          jsonBody,
          commonConfig.httpConfig
        )
        .then((response) => {
          resolve(response.data.d.results);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getObject(paramPathArray, query, interfaceMapping, commonConfig, btpAccessToken) {
    return new Promise((resolve, reject) => {
      //step 1: get the iFlow Keys and objectMapping
      let businessObject = paramPathArray[paramPathArray.length - 2];
      let objectMapping = interfaceMapping[businessObject];
      const iFlowKeys = this.constructIFlowKeysSingleObject(
        interfaceMapping,
        paramPathArray
      );

      // for each object including the current object, construct an array of the values to correspond to the iFlowKeys
      const iFlowKeyValues = [];
      for (let i = 1; i < paramPathArray.length; i += 2) {
        let keyValues = paramPathArray[i];
        keyValues.split("+").forEach((keyValue) => {
          iFlowKeyValues.push(keyValue);
        });
      }

      //add all iFlowKey-value pairs to the json body
      let jsonBody = {};
      if (query && Object.keys(query).length > 0) {
        if (objectMapping.hasOwnProperty("pathParams") && objectMapping.pathParams.length > 0) {
          Object.keys(query).forEach((key) => {
            if (objectMapping.pathParams.includes(key)) {
              jsonBody[key] = query[key];
            }
          });
        }
      } else {
        for (let i = 0; i < iFlowKeys.length; i++) {
          jsonBody[iFlowKeys[i]] = iFlowKeyValues[i];
        }
      }

      axios
        .post(
          commonConfig.iFlowUrl + objectMapping.getUrl,
          jsonBody,
          commonConfig.httpConfig
        )
        .then((response) => {
          if (btpAccessToken) {
            response.btpAccessToken = btpAccessToken;
          }
          resolve(response);
        })
        .catch((error) => {
          console.log("error");
          reject(error);
        });
    });
  }

  updateObject(paramPathArray, query, interfaceMapping, commonConfig, response, body) {
    return new Promise((resolve, reject) => {
      let businessObject = paramPathArray[paramPathArray.length - 2];
      let objectMapping = interfaceMapping[businessObject];
      const iFlowKeys = this.constructIFlowKeysSingleObject(
        interfaceMapping,
        paramPathArray
      );

      const jsonBody = {
        xCsrfToken: response.headers["x-csrf-token"],
        cookie: response.headers["set-cookie"].join(";"),
      };

      // for each object including the current object, construct an array of the values to correspond to the iFlowKeys
      const iFlowKeyValues = [];
      for (let i = 1; i < paramPathArray.length; i += 2) {
        let keyValues = paramPathArray[i];
        keyValues.split("+").forEach((keyValue) => {
          iFlowKeyValues.push(keyValue);
        });
      }

      //add all iFlowKey-value pairs to the json body
      if (query && Object.keys(query).length > 0) {
        if (objectMapping.hasOwnProperty("pathParams") && objectMapping.pathParams.length > 0) {
          Object.keys(query).forEach((key) => {
            if (objectMapping.pathParams.includes(key)) {
              jsonBody[key] = query[key];
            }
          });
        }
      } else {
        for (let i = 0; i < iFlowKeys.length; i++) {
          jsonBody[iFlowKeys[i]] = iFlowKeyValues[i];
        }
      }

      // Add the fields to update
      const updateRequestPayload = {};

      const updateObj = body;

      objectMapping.updateFields.forEach((field) => {
        field = field.trim();
        if (field in updateObj) {
          updateRequestPayload[field] = updateObj[field];
        }
      });

      jsonBody.d = updateRequestPayload;
      axios
        .post(
          commonConfig.iFlowUrl + objectMapping.updateUrl,
          jsonBody,
          commonConfig.httpConfig
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getValueHelpValues(parentObject, query, interfaceMapping, commonConfig) {

    return new Promise((resolve, reject) => {

      let reqBody;
      const selectPropertyName = query.select;
      let parentObjectConfigMapping = interfaceMapping[parentObject];
      let vhISuiteArtifactUrl = parentObjectConfigMapping.valuehelpUrl;
      let vhServiceCommonPath = parentObjectConfigMapping.valueHelp.url;

      if (vhServiceCommonPath.includes("/") && vhServiceCommonPath.indexOf("/") === 0) {
        vhServiceCommonPath = vhServiceCommonPath.substr(1);
      }

      parentObjectConfigMapping.valueHelp.mapping.forEach(map => {
        if (map.field.toString() == selectPropertyName.toString()) {
          reqBody = {
            commonPath: vhServiceCommonPath,
            specificPath: map.uri.includes("/") && map.uri.indexOf("/") == 0 ? map.uri.substr(1) : map.uri
          }
        }
      });

      axios.post(
        commonConfig.iFlowUrl + vhISuiteArtifactUrl,
        reqBody,
        commonConfig.httpConfig
      )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  }
}
module.exports = new IntegrationSuite();
