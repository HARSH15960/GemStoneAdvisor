const User = require('../models/User');

// Middleware to inject user info into response locals for views
const setUser = async (req, res, next) => {
  res.locals.user = null;
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('-password');
      if (user) {
        req.user = user;
        res.locals.user = user;
      }
    } catch (err) {
      console.error('Error fetching user in middleware:', err);
    }
  }
  next();
};

// Route protection for authenticated users
const protect = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
  }
  next();
};

// Admin route protection
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).render('error', {
      message: 'Access Denied: Admin authorization required.',
      error: { status: 403 }
    });
  }
  next();
};

module.exports = {
  setUser,
  protect,
  admin
};
