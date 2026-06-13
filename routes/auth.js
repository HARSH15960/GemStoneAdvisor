const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// User Registration
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

// User Login
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Admin Login
router.get('/admin-login', authController.getAdminLogin);
router.post('/admin-login', authController.postAdminLogin);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
