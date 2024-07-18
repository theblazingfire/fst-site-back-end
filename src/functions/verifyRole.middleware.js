const jwt = require("jsonwebtoken");
const Auth = require("../models/auth.model");
const logger = require("../utils/logger");
const config = require("../utils/config");

const verifyRole = (requiredRole) => {
  return async (req, res, next) => {
    let token = req.headers["authorization"]
    if(token){
      token = token.split(' ')[1]
    }
    
    if (!token) {
      logger.errorLogger("No token provided");
      return res.status(403).send("Access denied.");
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = await Auth.findById(decoded.id);
      if (!user) {
        logger.errorLogger("User not found");
        return res.status(404).send("User not found.");
      }

      if (user.role !== requiredRole) {
        logger.errorLogger(`User role ${user.role} does not have permission`);
        return res.status(403).send("Access denied.");
      }

      req.user = user;
      next();
    } catch (error) {
      logger.errorLogger("Invalid token");
      return res.status(401).send("Invalid token.");
    }
  };
};

module.exports = verifyRole;
