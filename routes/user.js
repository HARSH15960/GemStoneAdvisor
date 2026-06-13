const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes here require user login
router.use(protect);

// Dashboard & Profile
router.get('/dashboard', userController.getDashboard);
router.get('/profile', userController.getProfile);
router.post('/profile', userController.updateProfile);

// Recommendations
router.get('/recommend', userController.getRecommendForm);
router.post('/recommend', userController.postRecommendForm);
router.get('/recommendations/:id', userController.getRecommendResult);
router.get('/history', userController.getHistory);

// Favorites
router.get('/favorites', userController.getFavorites);
router.post('/favorites/toggle', userController.toggleFavorite);

module.exports = router;
