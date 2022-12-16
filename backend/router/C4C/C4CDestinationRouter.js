const Router = require("express");
const Destination = require("../../sap/destination");
const ResponseFormatter = require("../../helpers/responseFormatter");
const C4CDestinationRouter = Router();

// get single object's attribute dropdown list values through destination
C4CDestinationRouter.post("/ValueHelp", (req, res) => {
  Destination.getValueHelpValues(
    req.body,
    req.query,
    req.interfaceMapping,
    req.accessToken
  ).then((response) => {
    // C4C response differs from S4H
    res.send(response);
  }).catch((error) => {
    req.logger.error('C4CDestinationRouter ValueHelp error', error);
    res.status(500).send(error);
  });
});

// get collection of first level object
C4CDestinationRouter.get("/:obj1", (req, res) => {
  Destination.searchObject(
    req.params.obj1,
    req.query,
    req.interfaceMapping,
    req.accessToken,
    req.logger,
    false
  ).then((response) => {
    // C4C response differs from S4H
    res.send(response);
  }).catch((error) => {
    req.logger.error('C4CDestinationRouter get /:obj1 error', error);
    res.status(500).send(error);
  });
});

// get collection of second level object
C4CDestinationRouter.get("/:obj1/:id1/:obj2", (req, res) => {
  Destination.searchObjectItems(
    req.params.obj1,
    req.params.id1,
    req.params.obj2,
    req.query,
    req.interfaceMapping,
    req.accessToken,
    true
  ).then((response) => {
    // C4C response differs from S4H
    res.send(response);
  }).catch((error) => {
    req.logger.error('C4CDestinationRouter get /:obj1/:id1/:obj2 error', error);
    res.status(500).send(error);
  });
});

// get single first level object
C4CDestinationRouter.get("/:obj1/:id1", (req, res) => {
  Destination.getObject(
    req.params.obj1,
    req.params.id1,
    req.interfaceMapping,
    req.accessToken,
    req.logger
  ).then((response) => {
    res.send(response);
  }).catch((error) => {
    req.logger.error('C4CDestinationRouter get /:obj1/:id1/:obj2 error', error);
    res.status(500).send(error);
  });
});

// get single second level object
C4CDestinationRouter.get("/:obj1/:id1/:obj2/:id2", (req, res) => {
  Destination.getObjectItem(
    req.params.obj1,
    req.params.id1,
    req.params.obj2,
    req.params.id2,
    req.interfaceMapping,
    req.accessToken
  ).then((response) => {
    res.send(response);
  }).catch((error) => {
    req.logger.error('C4CDestinationRouter get /:obj1/:id1/:obj2/:id2 error', error);
    res.status(500).send(error);
  });
});

// update single first level object
C4CDestinationRouter.patch("/:obj1/:id1", (req, res) => {
  Destination.updateObject(
    req.params.obj1,
    req.params.id1,
    req.interfaceMapping,
    req.body,
    req.accessToken
  ).then((response) => {
    res.send(response);
  }).catch((error) => {
    req.logger.error('C4CDestinationRouter patch /:obj1/:id1 error', error);
    res.status(500).send(error);
  });
});

// Create a first level object
C4CDestinationRouter.post("/:obj1", (req, res) => {
  Destination.createObject(
    req.params.obj1,
    req.interfaceMapping,
    req.body,
    req.accessToken,
    req.logger
  ).then((response) => {
    res.send(response.d.results);
  }).catch((error) => {
    req.logger.error('C4CDestinationRouter createObject error', error);
    res.status(500).send(error);
  });
});

module.exports = C4CDestinationRouter;
