const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const authController = require('../controllers/authController');

// Apply rate limiter to all auth routes
router.use(authController.authRateLimiter);

// Sync user after Firebase auth (Login/Signup)
router.post('/sync', verifyToken, authController.syncUser);

// Legacy routes - redirected to use Firebase
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
