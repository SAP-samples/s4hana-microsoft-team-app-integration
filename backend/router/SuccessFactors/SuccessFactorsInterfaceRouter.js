const Router = require("express");
const SuccessFactorsInterfaceRouter = Router();

const IntegrationSuiteAuthRouter = require("./IntegrationSuiteAuthRouter");
const IntegrationSuiteRouter = require("./IntegrationSuiteRouter");
// const GraphAuthRouter = require("./GraphAuthRouter");
// const GraphRouter = require("./GraphRouter");
const DestinationRouter = require("./DestinationRouter");
const DestinationAuthRouter = require("./DestinationAuthRouter");
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

SuccessFactorsInterfaceRouter.use(
  "/IntegrationSuite",
  getInterfaceMappingConfig,
  IntegrationSuiteAuthRouter,
  IntegrationSuiteRouter
);
// SuccessFactorsInterfaceRouter.use("/Graph", getInterfaceMappingConfig, GraphAuthRouter, GraphRouter);
SuccessFactorsInterfaceRouter.use(
  "/Destination",
  getInterfaceMappingConfig,
  DestinationAuthRouter,
  DestinationRouter
);

module.exports = SuccessFactorsInterfaceRouter;
