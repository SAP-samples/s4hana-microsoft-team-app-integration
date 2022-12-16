const env = process.env;
const Router = require("express");
const OnPremIntegrationSuiteAuthRouter = Router();
const AuthManager = require("../../services/authManager");

const getCommonConfig = function (req, res, next) {
  // const logger = req.logger;
  // logger.info("fetching BTP accessToken");
  AuthManager.getBtpAccessTokenWithTeamsAuthToken(
    req.headers.teams_auth_token
  ).then((btpAccessToken) => {
    req.commonConfig = {
      iFlowUrl: env.iFlowUrl,
      httpConfig: {
        headers: {
          Authorization: `Bearer ${btpAccessToken}`,
          "Content-Type": "application/json",
        },
      },
    };
    next();
  });
};
OnPremIntegrationSuiteAuthRouter.use(getCommonConfig);
module.exports = OnPremIntegrationSuiteAuthRouter;
