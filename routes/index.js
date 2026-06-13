const express = require('express');
const router = express.Router();
const Gemstone = require('../models/Gemstone');

// @desc    Public Homepage
// @route   GET /
router.get('/', async (req, res) => {
  try {
    // Retrieve a few popular gemstones to showcase on the landing page
    const popularGemstones = await Gemstone.find().limit(3);
    res.render('index', { gemstones: popularGemstones });
  } catch (err) {
    console.error('Error fetching gemstones for landing page:', err);
    res.render('index', { gemstones: [] });
  }
});

module.exports = router;
