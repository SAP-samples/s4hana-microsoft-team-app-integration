const Router = require("express");
const S4HanaCloudInterfaceRouter = Router();

const IntegrationSuiteAuthRouter = require("./IntegrationSuiteAuthRouter");
const IntegrationSuiteRouter = require("./IntegrationSuiteRouter");
const GraphAuthRouter = require("./GraphAuthRouter");
const GraphRouter = require("./GraphRouter");
const DestinationAuthRouter = require("./DestinationAuthRouter");
const DestinationRouter = require("./DestinationRouter");
const ConfigInterface = require("../../helpers/configInterface");

const getInterfaceMappingConfig = function (req, res, next) {
  const params = req.baseUrl.split("/");
  const systemName = params[2];
  const interfaceName = params[3];

  ConfigInterface.getInterfaceMappingConfig(
    "/backend/objectMappingConfig.json",
    req.logger
  ).then((interfaceMapping) => {
    req.interfaceMapping = interfaceMapping[systemName][interfaceName];
    next();
  });
};

S4HanaCloudInterfaceRouter.use(
  "/IntegrationSuite",
  getInterfaceMappingConfig,
  IntegrationSuiteAuthRouter,
  IntegrationSuiteRouter
);
S4HanaCloudInterfaceRouter.use(
  "/Graph",
  getInterfaceMappingConfig,
  GraphAuthRouter,
  GraphRouter
);
S4HanaCloudInterfaceRouter.use(
  "/Destination",
  getInterfaceMappingConfig,
  DestinationAuthRouter,
  DestinationRouter
);

module.exports = S4HanaCloudInterfaceRouter;
