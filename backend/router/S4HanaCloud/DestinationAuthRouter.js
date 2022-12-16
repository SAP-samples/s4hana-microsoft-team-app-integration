const Router = require("express");
const DestinationAuthRouter = Router();
const AuthManager = require("../../services/authManager");

const getDestinationAccessToken = function (req, res, next) {
  // Do nothing
  next();
};

DestinationAuthRouter.use(getDestinationAccessToken);
module.exports = DestinationAuthRouter;
