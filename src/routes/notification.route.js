// notification.route.ts
const Router = require('express').Router
const notificationController = require('../controllers/notification.controller')

const router = Router();

// Create notification
router.post('/', notificationController.createNotification);

// Get all notifications (with pagination)
router.get('/', notificationController.getAllNotifications);

// Get notification by ID
router.get('/:id', notificationController.getNotificationById);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Delete notification by ID
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
