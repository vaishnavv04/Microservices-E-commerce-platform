const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
} = require('../middleware/validation');

router.post('/register', validateRegister, userController.register);
router.post('/login', validateLogin, userController.login);
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, validateUpdateProfile, userController.updateProfile);

module.exports = router;

