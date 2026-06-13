const User = require('../models/User');

exports.getSignup = (req, res) => {
  if (req.session.userId) {
    return res.redirect('/user/dashboard');
  }
  res.render('auth/signup', { error: null, success: null });
};

exports.postSignup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    if (!name || !email || !password || !confirmPassword) {
      return res.render('auth/signup', { error: 'All fields are required', name, email });
    }

    if (password !== confirmPassword) {
      return res.render('auth/signup', { error: 'Passwords do not match', name, email });
    }

    if (password.length < 6) {
      return res.render('auth/signup', { error: 'Password must be at least 6 characters', name, email });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.render('auth/signup', { error: 'Email is already registered', name, email });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    req.session.userId = user._id;
    req.session.userRole = user.role;

    res.redirect('/user/dashboard');
  } catch (err) {
    console.error(err);
    res.render('auth/signup', { error: 'Registration failed. Please try again.', name, email });
  }
};

exports.getLogin = (req, res) => {
  if (req.session.userId) {
    return res.redirect('/user/dashboard');
  }
  res.render('auth/login', { error: null, email: '' });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.render('auth/login', { error: 'Please enter email and password', email });
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', { error: 'Invalid email or password', email });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Invalid email or password', email });
    }

    // Initialize session
    req.session.userId = user._id;
    req.session.userRole = user.role;

    // Redirect to intended route or dashboard
    const returnTo = req.session.returnTo || (user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'Authentication failed. Please try again.', email });
  }
};

exports.getAdminLogin = (req, res) => {
  if (req.session.userId && req.session.userRole === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  res.render('auth/admin-login', { error: null, email: '' });
};

exports.postAdminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.render('auth/admin-login', { error: 'Please enter email and password', email });
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') {
      return res.render('auth/admin-login', { error: 'Invalid credentials or access unauthorized', email });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.render('auth/admin-login', { error: 'Invalid credentials', email });
    }

    // Initialize session
    req.session.userId = user._id;
    req.session.userRole = user.role;

    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.render('auth/admin-login', { error: 'Admin authentication failed.', email });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
};
