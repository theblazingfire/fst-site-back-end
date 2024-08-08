const express = require('express');
const router = express.Router();
const { postCustomerMessage, replyToCustomerMessage, getCustomerMessages } = require('../controllers/customer_messages.controller');
const verifyToken = require("../functions/verifyToken.middleware");

// Route to handle posting customer messages
router.post('/messages', postCustomerMessage);

// Route to handle posting customer messages
router.get('/messages', getCustomerMessages);

// Route to handle admin replying to a customer message
router.post('/messages/:messageId/reply', verifyToken, replyToCustomerMessage);

module.exports = router;
