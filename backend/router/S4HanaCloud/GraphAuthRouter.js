const Router = require("express");
const GraphAuthRouter = Router();
const AuthManager = require("../../services/authManager");

const getSapGraphAccessToken = function (req, res, next) {
  // const logger = req.logger;
  // logger.info("fetching SAP Graph accessToken")
  AuthManager.getGraphAccessTokenWithTeamsAuthToken(
    req.headers.teams_auth_token
  ).then((accessToken) => {
    req.accessToken = accessToken;
    next();
  });
};

GraphAuthRouter.use(getSapGraphAccessToken);
module.exports = GraphAuthRouter;
