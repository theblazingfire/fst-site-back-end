const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const verifyToken = require('../functions/verifyToken.middleware');

// Chat-related routes
router.post('/create-chat', verifyToken, chatController.createChat);
router.post('/:chatId/messages', verifyToken, chatController.sendMessage);
router.get('/:chatId/messages', verifyToken, chatController.getMessages);
router.patch('/:chatId/messages/read', verifyToken, chatController.markMessagesAsRead);
router.delete('/:chatId/messages/:messageId', verifyToken, chatController.deleteMessage);
router.patch('/:chatId/archive', verifyToken, chatController.archiveChat);
router.patch('/:chatId/unarchive', verifyToken, chatController.unarchiveChat);
router.patch('/:chatId/mute', verifyToken, chatController.muteChat);
router.patch('/:chatId/unmute', verifyToken, chatController.unmuteChat);
router.patch('/:chatId/leave', verifyToken, chatController.leaveChat);
router.delete('/:chatId', verifyToken, chatController.deleteChat);
router.get('/user/:userId', verifyToken, chatController.getUserChats);

module.exports = router;
