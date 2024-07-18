const jwt = require("jsonwebtoken");
const config = require("../utils/config");
// Middleware to check token-based authentication
function verifyToken(req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];
  if (token) {
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid token", error: "Unauthorized" });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
}

module.exports = verifyToken;
