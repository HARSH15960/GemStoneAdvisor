const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// All admin routes require authentication AND admin authorization
router.use(protect);
router.use(admin);

// Admin Dashboard
router.get('/dashboard', adminController.getDashboard);

// User Management
router.get('/users', adminController.getUsers);
router.post('/users/:id/toggle-role', adminController.toggleUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Gemstone CRUD Management
router.get('/gemstones', adminController.getGemstones);
router.get('/gemstones/new', adminController.getAddGemstone);
router.post('/gemstones', adminController.createGemstone);
router.get('/gemstones/:id/edit', adminController.getEditGemstone);
router.put('/gemstones/:id', adminController.updateGemstone);
router.delete('/gemstones/:id', adminController.deleteGemstone);

module.exports = router;
