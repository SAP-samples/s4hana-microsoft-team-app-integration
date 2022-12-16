const core = require("@sap-cloud-sdk/core");
const ResponseFormatter = require("../helpers/responseFormatter");
const UrlHelper = require("../helpers/urlHelper");

class Destination {
  searchObject(
    businessObject,
    query,
    interfaceMapping,
    accessToken,
    logger,
    switchSubstringofParams = false
  ) {
    return new Promise((resolve, reject) => {
      const objectMapping = interfaceMapping[businessObject];

      const url = objectMapping.url;
      const params = ResponseFormatter.toParams(
        query,
        objectMapping.searchFields,
        switchSubstringofParams
      );
      console.log("System Query Options: " + params.toString());
      const destination = { destinationName: objectMapping.destinationName };
      if (objectMapping.accessToken) {
        destination["jwt"] = accessToken;
      }

      core
        .executeHttpRequest(destination, {
          method: "GET",
          url: `${url}?${params}`,
        })
        .then((response) => {
          logger.info(
            "Data received from searchobject in destination.js",
            response.data.d.results
          );
          resolve(response.data.d.results);
        })
        .catch((error) => {
          logger.error("searchObject error in destination.js", error);
          reject(error);
        });
    });
  }

  searchObjectItems(
    businessObject,
    id,
    businessObjectItem,
    query,
    interfaceMapping,
    accessToken,
    switchSubstringofParams = false
  ) {
    return new Promise((resolve, reject) => {
      const objectMapping = interfaceMapping[businessObject];
      const objectItemMapping = interfaceMapping[businessObjectItem];

      const url = `${objectMapping.url}('${id}')/${objectItemMapping.suffix}`;
      const params = ResponseFormatter.toParams(
        query,
        objectMapping.searchFields,
        switchSubstringofParams
      );
      const destination = { destinationName: objectMapping.destinationName };
      if (objectMapping.accessToken) {
        destination["jwt"] = accessToken;
      }

      core
        .executeHttpRequest(destination, {
          method: "GET",
          url: `${url}?${params}`,
        })
        .then((response) => {
          resolve(response.data.d.results);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getObject(businessObject, id, interfaceMapping, query, accessToken, logger) {
    return new Promise((resolve, reject) => {
      const objectMapping = interfaceMapping[businessObject];

      const url = UrlHelper.generateFirstLevelRequestUrl(objectMapping, id, query);

      const destination = { destinationName: objectMapping.destinationName };
      if (objectMapping.accessToken) {
        destination["jwt"] = accessToken;
      }

      core
        .executeHttpRequest(destination, { method: "GET", url: url })
        .then((response) => {
          logger.info("data received in destination getObject");
          resolve(response.data.d);
        })
        .catch((error) => {
          logger.error("error in destination getObject", error);
          reject(error);
        });
    });
  }

  getObjectItem(
    businessObject,
    id,
    businessObjectItem,
    itemId,
    query,
    interfaceMapping,
    accessToken
  ) {
    return new Promise((resolve, reject) => {
      const objectMapping = interfaceMapping[businessObject];
      const objectItemMapping = interfaceMapping[businessObjectItem];

      const url = UrlHelper.generateSecondLevelRequestUrl(businessObject, id, businessObjectItem,
        itemId, objectItemMapping, query);
      const destination = { destinationName: objectMapping.destinationName };
      if (objectMapping.accessToken) {
        destination["jwt"] = accessToken;
      }
      core
        .executeHttpRequest(
          destination,
          { method: "GET", url: url },
          { fetchCsrfToken: true }
        )

        .then((response) => {
          resolve(response.data.d);
        })
        .catch((error) => {
          console.log("getObjectItem error", error);
          reject(error);
        });
    });
  }

  updateObject(businessObject, id, interfaceMapping, body, query, accessToken) {
    return new Promise((resolve, reject) => {

      const objectMapping = interfaceMapping[businessObject];
      const url = UrlHelper.generateFirstLevelRequestUrl(objectMapping, id, query);
      const destination = { destinationName: objectMapping.destinationName };
      if (objectMapping.accessToken) {
        destination["jwt"] = accessToken;
      }

      core
        .executeHttpRequest(
          destination,
          { method: "PATCH", url: url, data: body },
          { fetchCsrfToken: true }
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log("updateObject error", error);
          reject(error);
        });
    });
  }

  submitData(
    businessObject,
    id,
    interfaceMapping,
    body,
    accessToken,
    isReview
  ) {
    const objectMapping = interfaceMapping[businessObject];

    let payload = {};
    let url = "";
    if (isReview) {
      // construct taskprocessing url here
      if (body.hasOwnProperty("workFlowId")) {
        url = `${objectMapping.actionUrl}&InstanceID='${body.workFlowId}'&DecisionKey='${body.decisionKey}'`;
      } else {
        console.log("Request is non-workflowType\n");
        // Add non-workflow type review logic here
      }
    } else {
      payload = { ...body };
      url = `${objectMapping.url}('${id}')`;
    }

    return new Promise((resolve, reject) => {
      const destination = { destinationName: objectMapping.destinationName };
      if (objectMapping.accessToken) {
        destination["jwt"] = accessToken;
      }
      core
        .executeHttpRequest(
          destination,
          { method: "POST", url: url },
          { fetchCsrfToken: true }
        )
        .then((response) => {
          console.log("Response from SubmitObject ", response);
          resolve(response);
        })
        .catch((error) => {
          console.log("Error in SubmitObject ", error);
          reject(error);
        });
    });
  }

  getValueHelpValues(reqBody, reqQuery, interfaceMapping, accessToken) {
    return new Promise((resolve, reject) => {
      let parentObject = reqBody.parentObject;
      if (interfaceMapping.hasOwnProperty(parentObject.toString())) {
        let parentObjectConfig = interfaceMapping[parentObject];
        let selectPropertyName = reqQuery.select;
        let valueHelpUri = parentObjectConfig.valueHelp.url;

        let selectPropertyValueHelpUri = null;
        parentObjectConfig.valueHelp.mapping.forEach((mapping) => {
          if (mapping.field.toString() == selectPropertyName.toString()) {
            selectPropertyValueHelpUri = mapping.uri;
          }
        });

        let helpValueURL = valueHelpUri + selectPropertyValueHelpUri;

        let destination = {
          destinationName: parentObjectConfig.destinationName,
        };
        if (parentObjectConfig.accessToken) {
          destination["jwt"] = accessToken;
        }

        core
          .executeHttpRequest(destination, { method: "GET", url: helpValueURL })
          .then((response) => {
            resolve(response.data.d.results);
          })
          .catch((error) => {
            console.log("getObjectItem error", error);
            reject(error);
          });
      }
    });
  }

  updateSecondaryObject(
    parentObject,
    pId,
    subObject,
    sId,
    interfaceMapping,
    query,
    body,
    accessToken
  ) {
    return new Promise((resolve, reject) => {
      const parentObjectMapping = interfaceMapping[parentObject];
      const subObjectMapping = interfaceMapping[subObject];
      const url = UrlHelper.generateSecondLevelRequestUrl(parentObject, pId, subObject, sId, subObjectMapping, query);

      const destination = {
        destinationName: parentObjectMapping.destinationName,
      };
      if (parentObjectMapping.accessToken) {
        destination["jwt"] = accessToken;
      }

      core
        .executeHttpRequest(
          destination,
          { method: "PATCH", url: url, data: body },
          { fetchCsrfToken: true }
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log("updateObject error", error);
          reject(error);
        });
    });
  }

  createObject(businessObject, interfaceMapping, body, accessToken, logger) {
    return new Promise((resolve, reject) => {
      const objectMapping = interfaceMapping[businessObject];
      const url = objectMapping.url;
      const destination = { destinationName: objectMapping.destinationName };
      if (objectMapping.accessToken) {
        destination["jwt"] = accessToken;
      }
      core.executeHttpRequest(
        destination,
        { method: "POST", url: url, data: body },
        { fetchCsrfToken: true }
      ).then((response) => {
        resolve(response);
      }).catch((error) => {
        logger.error("createObject error", error);
        reject(error);
      });
    });
  }
}
module.exports = new Destination();
