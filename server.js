require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const { setUser } = require('./middleware/auth');

// Initialize express app
const app = express();

// Connect to MongoDB Database
connectDB();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method Override Middleware (for PUT/DELETE inside EJS forms)
app.use(methodOverride('_method'));

// Serve Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// Configure Express Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'cosmic_gemstone_session_secret_192837',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours duration
    httpOnly: true
  }
}));

// Set template engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Inject User info globally into EJS views
app.use(setUser);

// Define Router Mounts
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/admin', require('./routes/admin'));

// Catch-all 404 handler
app.use((req, res, next) => {
  const error = new Error('Resource Not Found');
  error.status = 404;
  next(error);
});

// Global Error Handler Middleware
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  res.status(statusCode).render('error', {
    message: error.message || 'Internal Server Error',
    error: {
      status: statusCode,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : null
    }
  });
});

// Listen on Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
