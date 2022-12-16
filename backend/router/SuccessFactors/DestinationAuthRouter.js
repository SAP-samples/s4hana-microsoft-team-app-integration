const Router = require("express");
const DestinationAuthRouter = Router();
const AuthManager = require("../../services/authManager");

const getBtpAccessToken = function (req, res, next) {
  // const logger = req.logger;
  // logger.info("fetching BTP accessToken");
  AuthManager.getBtpXsuaaAccessTokenWithTeamsAuthToken(
    req.headers.teams_auth_token
  ).then((accessToken) => {
    req.accessToken = accessToken;
    next();
  });
};
DestinationAuthRouter.use(getBtpAccessToken);
module.exports = DestinationAuthRouter;
