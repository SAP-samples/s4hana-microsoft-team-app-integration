const Router = require("express");
const Destination = require("../../sap/destination");
const ResponseFormatter = require("../../helpers/responseFormatter");
const DestinationRouter = Router();

// get single object's attribute dropdown list values through destination
DestinationRouter.post("/ValueHelp", (req, res) => {

  let parentObject = req.body.parentObject;
  let query = req.query;
  if (req.interfaceMapping.hasOwnProperty(parentObject.toString())) {

    let parentObjectConfig = req.interfaceMapping[parentObject];
    let selectPropertyName = query.select;
    let valueHelpUri = parentObjectConfig.valueHelp.url;

    let selectPropertyValueHelpUri = null;
    parentObjectConfig.valueHelp.mapping.forEach(mapping => {
      if (mapping.field.toString() == selectPropertyName.toString()) {
        selectPropertyValueHelpUri = mapping.uri;
      }
    });

    let helpValueURL = valueHelpUri + selectPropertyValueHelpUri;
    Destination.getValueHelpValues(helpValueURL, parentObjectConfig, req.accessToken)
      .then((response) => {
        return ResponseFormatter.formatTableData(response, req.logger);
      })
      .then((response) => {
        res.send(response)
      })
      .catch((error) => {
        res.send(error).status(error.statueCode)
      });
  }
});

// get collection of first level object
DestinationRouter.get("/:obj1", (req, res) => {
  Destination.searchObject(
    req.params.obj1,
    req.query,
    req.interfaceMapping,
    req.accessToken,
    req.logger,
    true
  )
    .then((response) => {
      return ResponseFormatter.formatTableData(response, req.logger);
    })
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// get collection of second level object
DestinationRouter.get("/:obj1/:id1/:obj2", (req, res) => {
  Destination.searchObjectItems(
    req.params.obj1,
    req.params.id1,
    req.params.obj2,
    req.query,
    req.interfaceMapping,
    req.accessToken,
    true
  )
    .then((response) => {
      return ResponseFormatter.formatTableData(response, req.logger);
    })
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send(error);
    });
});

// get single first level object
DestinationRouter.get("/:obj1/:id1", (req, res) => {
  Destination.getObject(
    req.params.obj1,
    req.params.id1,
    req.interfaceMapping,
    req.query,
    req.accessToken,
    req.logger
  )
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send(error);
    });
});

// get single second level object
DestinationRouter.get("/:obj1/:id1/:obj2/:id2", (req, res) => {
  Destination.getObjectItem(
    req.params.obj1,
    req.params.id1,
    req.params.obj2,
    req.params.id2,
    req.query,
    req.interfaceMapping,
    req.accessToken
  )
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send(error);
    });
});

// update single first level object
DestinationRouter.patch("/:obj1/:id1", (req, res) => {
  Destination.updateObject(
    req.params.obj1,
    req.params.id1,
    req.interfaceMapping,
    req.body,
    req.query,
    req.accessToken
  )
    .then((response) => {
      res.send(ResponseFormatter.successMessage(response));
    })
    .catch((error) => {
      res.status(error.response.status);
      res.send(ResponseFormatter.errorMessage(req, error, req.logger));
    });
});

// Create a first level object
DestinationRouter.post("/:obj1", (req, res) => {
  Destination.createObject(
    req.params.obj1,
    req.interfaceMapping,
    req.body,
    req.accessToken,
    req.logger
  ).then((response) => {
    res.send(ResponseFormatter.successMessage(response));
  }).catch((error) => {
    req.logger.error('SuccessFactors DestinationRouter createObject error', error);
    res.status(500).send(error);
  });
});

module.exports = DestinationRouter;
