const env = process.env;
const Router = require("express");
const IntegrationSuiteAuthRouter = Router();

const getCommonConfig = function (req, res, next) {
  req.commonConfig = {
    iFlowUrl: env.iFlowUrl,
    httpConfig: {
      headers: {
        Authorization: "Basic " + Buffer.from(env.iFlowClientId + ":" + env.iFlowClientSecret, "utf8").toString("base64"),
        "Content-Type": "application/json"
      }
    }
  }
  next();
}
IntegrationSuiteAuthRouter.use(getCommonConfig);
module.exports = IntegrationSuiteAuthRouter;