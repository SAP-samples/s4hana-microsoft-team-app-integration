const Router = require("express");
const SapGraph = require("../../sap/sapGraph");
const ResponseFormatter = require("../../helpers/responseFormatter");
const GraphRouter = Router();

// // get single object's attribute dropdown list values through SAP Graph
GraphRouter.post("/ValueHelp", (req, res) => {

  SapGraph.getValueHelpValues(req.body, req.query, req.interfaceMapping, req.accessToken)
    .then((response) => {
      return ResponseFormatter.formatTableData(response, req.logger);
    })
    .then((response) => {
      res.send(response)
    })
    .catch((error) => {
      res.send(error).status(error.statueCode)
    });
});

// get collection of first level object
GraphRouter.get("/:obj1", (req, res) => {
  const paramPathArray = [req.params.obj1];
  SapGraph.searchObject(paramPathArray, req.query, req.interfaceMapping, req.accessToken).then((response) => {
    return ResponseFormatter.formatTableData(response, req.logger);
  }).then((response) => {
    res.send(response);
  }).catch((error) => {
    res.send(error);
  });
});

// get collection of second level object
GraphRouter.get("/:obj1/:id1/:obj2", (req, res) => {
  const paramPathArray = [req.params.obj1, req.params.id1, req.params.obj2];
  SapGraph.searchObject(paramPathArray, req.query, req.interfaceMapping, req.accessToken).then((response) => {
    return ResponseFormatter.formatTableData(response, req.logger);
  }).then((response) => {
    res.send(response);
  }).catch((error) => {
    res.send(error);
  });
});

// get single first level object
GraphRouter.get("/:obj1/:id1", (req, res) => {
  const paramPathArray = [req.params.obj1, req.params.id1];
  SapGraph.getObject(paramPathArray, req.query, req.interfaceMapping, req.accessToken).then((response) => {
    res.send(response);
  }).catch((error) => {
    res.send(error);
  });
});

// get single second level object
GraphRouter.get("/:obj1/:id1/:obj2/:id2", (req, res) => {
  const paramPathArray = [req.params.obj1, req.params.id1, req.params.obj2, req.params.id2];
  SapGraph.getObject(paramPathArray, req.query, req.interfaceMapping, req.accessToken).then((response) => {
    res.send(response);
  }).catch((error) => {
    res.send(error);
  });
});

// update single first level object
GraphRouter.patch("/:obj1/:id1", (req, res) => {
  const paramPathArray = [req.params.obj1, req.params.id1];
  SapGraph.updateObject(paramPathArray, req.query, req.interfaceMapping, req.body, req.accessToken, req.logger).then((response) => {
    res.send(ResponseFormatter.successMessage(response));
  }).catch((error) => {
    res.status(error.response.status);
    res.send(ResponseFormatter.errorMessage(req, error, req.logger));
  });
});

// update single second level object
GraphRouter.patch("/:obj1/:id1/:obj2/:id2", (req, res) => {
  const paramPathArray = [req.params.obj1, req.params.id1, req.params.obj2, req.params.id2];
  SapGraph.updateObject(paramPathArray, req.query, req.interfaceMapping, req.body, req.accessToken, req.logger).then((response) => {
    res.send(ResponseFormatter.successMessage(response));
  }).catch((error) => {
    res.status(error.response.status);
    res.send(ResponseFormatter.errorMessage(req, error, req.logger));
  });
});

module.exports = GraphRouter;