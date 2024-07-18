const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

// Controller for the ping endpoint
const ping = (req, res) => {
  res.status(200).send("pong");
};

// Controller for the status endpoint
const status = (req, res) => {
  const statusInfo = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  res.status(200).json(statusInfo);
};

// Controller to read request logs
const getRequestLogs = (req, res) => {
  const logPath = path.join(__dirname, "../request.log");
  fs.readFile(logPath, "utf8", (err, data) => {
    if (err) {
      logger.errorLogger("Error reading request logs");
      return res.status(500).send("Error reading request logs");
    }
    res.status(200).send(data.toString());
  });
};

// Controller to read app logs
const getAppLogs = (req, res) => {
  const logPath = path.join(__dirname, "../applog.md");
  fs.readFile(logPath, "utf8", (err, data) => {
    if (err) {
      logger.errorLogger("Error reading app logs");
      logger.errorLogger(err);
      return res.status(500).send("Error reading app logs");
    }
    res.status(200).send(data);
  });
};

// Controller to clear request logs
const clearRequestLogs = (req, res) => {
  const logPath = path.join(__dirname, "request.log");
  fs.writeFile(logPath, "", (err) => {
    if (err) {
      logger.errorLogger("Error clearing request logs");
      logger.errorLogger(err);
      return res.status(500).send("Error clearing request logs");
    }
    logger.infoLogger("Request logs cleared");
    res.status(200).send("Request logs cleared");
  });
};

// Controller to clear app logs
const clearAppLogs = (req, res) => {
  const logPath = path.join(__dirname, "applog.md");
  fs.writeFile(logPath, "", (err) => {
    if (err) {
      logger.errorLogger("Error clearing app logs");
      logger.errorLogger(err);
      return res.status(500).send("Error clearing app logs");
    }
    logger.infoLogger("App logs cleared");
    res.status(200).send("App logs cleared");
  });
};

module.exports = {
  ping,
  status,
  getRequestLogs,
  getAppLogs,
  clearRequestLogs,
  clearAppLogs,
};
