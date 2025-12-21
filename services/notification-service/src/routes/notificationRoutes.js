const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { validateEmail, validateSMS } = require('../middleware/validation');

router.post('/notifications/email', validateEmail, notificationController.sendEmailNotification);
router.post('/notifications/sms', validateSMS, notificationController.sendSMSNotification);

module.exports = router;

