const Router = require("express");
const C4CDestinationAuthRouter = Router();
const AuthManager = require("../../services/authManager");

const getBtpAccessToken = function (req, res, next) {
  AuthManager.getBtpXsuaaAccessTokenWithTeamsAuthToken(
    req.headers.teams_auth_token
  ).then((accessToken) => {
    req.accessToken = accessToken;
    next();
  });
};

C4CDestinationAuthRouter.use(getBtpAccessToken);
module.exports = C4CDestinationAuthRouter;
