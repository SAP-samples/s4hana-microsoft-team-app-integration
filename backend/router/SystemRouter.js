const Router = require("express");

const SystemRouter = Router();
const S4HanaCloudInterfaceRouter = require("./S4HanaCloud/S4HanaCloudInterfaceRouter");
const S4HanaOnPremInterfaceRouter = require("./S4HanaOnPrem/S4HanaOnPremInterfaceRouter");
const SuccessFactorsInterfaceRouter = require("./SuccessFactors/SuccessFactorsInterfaceRouter");
const C4CInterfaceRouter = require("./C4C/C4CInterfaceRouter");

SystemRouter.use("/S4HanaCloud", S4HanaCloudInterfaceRouter);
SystemRouter.use("/S4HanaOnPrem", S4HanaOnPremInterfaceRouter);
SystemRouter.use("/SuccessFactors", SuccessFactorsInterfaceRouter);
SystemRouter.use("/C4C", C4CInterfaceRouter);

module.exports = SystemRouter;
