const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const config = require("../utils/config");

const verifyRole = (requiredRole) => {
  return async (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    if(token){
      jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Invalid token", error: "Unauthorized" });
        }
        if(decoded.role == requiredRole){
          req.user = decoded;
          console.log('decoded', decoded)
          next()
        }
        else {
          return res.status(403).send("Access denied.");
        }
      });
    }
    else {
      logger.errorLogger("No token provided");
      return res.status(403).send("Access denied.");
    }
  };
};

module.exports = verifyRole;


