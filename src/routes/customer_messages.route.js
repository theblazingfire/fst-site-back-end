const express = require("express");
const router = express.Router();
const {
  postCustomerMessage,
  replyToCustomerMessage,
  getCustomerMessages,
} = require("../controllers/customer_messages.controller");
const verifyRole = require("../functions/verifyRole.middleware");

// Route to handle posting customer messages
router.post("/", postCustomerMessage);

// Route to handle posting customer messages
router.get("/", getCustomerMessages);

// Route to handle admin replying to a customer message
router.post("/reply/:messageId", verifyRole("admin"), replyToCustomerMessage);

module.exports = router;
