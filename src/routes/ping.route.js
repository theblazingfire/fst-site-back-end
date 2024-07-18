const express = require("express");
const router = express.Router();
const pingController = require("../controllers/ping.controller");

// Route to handle the ping endpoint
router.get("/", pingController.ping);

// Route to handle the status endpoint
router.get("/status", pingController.status);

// Route to handle request logs
router.get("/request-logs", pingController.getRequestLogs);

// Route to handle app logs
router.get("/app-logs", pingController.getAppLogs);

// Route to clear request logs
router.get("/clear-request-logs", pingController.clearRequestLogs);

// Route to clear app logs
router.get("/clear-app-logs", pingController.clearAppLogs);

module.exports = router;
