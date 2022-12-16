const Router = require("express");
const C4CInterfaceRouter = Router();

const C4CDestinationRouter = require("./C4CDestinationRouter");
const C4CDestinationAuthRouter = require("./C4CDestinationAuthRouter");
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

C4CInterfaceRouter.use(
  "/Destination",
  getInterfaceMappingConfig,
  C4CDestinationAuthRouter,
  C4CDestinationRouter
);

module.exports = C4CInterfaceRouter;
