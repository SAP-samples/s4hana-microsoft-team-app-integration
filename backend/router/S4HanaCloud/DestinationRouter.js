const Router = require("express");
const Destination = require("../../sap/destination");
const ResponseFormatter = require("../../helpers/responseFormatter");
const DestinationRouter = Router();

// get single object's attribute dropdown list values through destination
DestinationRouter.post("/ValueHelp", (req, res) => {
  Destination.getValueHelpValues(req.body, req.query, req.interfaceMapping, req.accessToken)
    .then((response) => {
      return ResponseFormatter.formatTableData(response, req.logger);
    })
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.status(error.response.status).send(ResponseFormatter.errorMessage(req, error, req.logger));
    });
});

// get collection of first level object
DestinationRouter.get("/:obj1", (req, res) => {
  Destination.searchObject(req.params.obj1, req.query, req.interfaceMapping, req.accessToken, req.logger).then((response) => {
    return ResponseFormatter.formatTableData(response, req.logger);
  }).then((response) => {
    res.send(response);
  }).catch((error) => {
    res.status(error.response.status).send(ResponseFormatter.errorMessage(req, error, req.logger));
  });
});

// get collection of second level object
DestinationRouter.get("/:obj1/:id1/:obj2", (req, res) => {
  Destination.searchObjectItems(req.params.obj1, req.params.id1, req.params.obj2, req.query, req.interfaceMapping, req.accessToken).then((response) => {
    return ResponseFormatter.formatTableData(response, req.logger);
  }).then((response) => {
    res.send(response);
  }).catch((error) => {
    res.status(error.response.status).send(ResponseFormatter.errorMessage(req, error, req.logger));
  });
});

// get single first level object
DestinationRouter.get("/:obj1/:id1", (req, res) => {
  Destination.getObject(req.params.obj1, req.params.id1, req.interfaceMapping, req.query, req.accessToken, req.logger).then((response) => {
    res.send(response);
  }).catch((error) => {
    res.status(error.response.status).send(ResponseFormatter.errorMessage(req, error, req.logger));
  });
});

// get single second level object
DestinationRouter.get("/:obj1/:id1/:obj2/:id2", (req, res) => {
  Destination.getObjectItem(req.params.obj1, req.params.id1, req.params.obj2, req.params.id2, req.query, req.interfaceMapping, req.accessToken).then((response) => {
    res.send(response);
  }).catch((error) => {
    res.status(error.response.status).send(ResponseFormatter.errorMessage(req, error, req.logger));
  });
});

// update single first level object
DestinationRouter.patch("/:obj1/:id1", (req, res) => {
  Destination.updateObject(req.params.obj1, req.params.id1, req.interfaceMapping, req.body, req.query, req.accessToken).then((response) => {
    res.send(ResponseFormatter.successMessage(response));
  }).catch((error) => {
    res.status(error.response.status).send(ResponseFormatter.errorMessage(req, error, req.logger));
  });
});

// update single second level object
DestinationRouter.patch("/:obj1/:id1/:obj2/:id2", (req, res) => {
  Destination.updateSecondaryObject(
    req.params.obj1,
    req.params.id1,
    req.params.obj2,
    req.params.id2,
    req.interfaceMapping,
    req.query,
    req.body,
    req.accessToken
  )
    .then((response) => {
      res.send(ResponseFormatter.successMessage(response));
    })
    .catch((error) => {
      res.status(error.response.status).send(ResponseFormatter.errorMessage(req, error, req.logger));
    });
});

module.exports = DestinationRouter;