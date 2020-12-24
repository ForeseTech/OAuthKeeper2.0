const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect Routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    req.flash('error', 'Please log in to view the page');
    return res.redirect('/users/login');
  }

  // Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    req.flash('error', 'Please log in to view the page');
    return res.redirect('/users/login');
  }
});

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      req.flash('error', `User role ${req.user.role} is not authorized to perform this operation`);
      return res.redirect('/contacts');
    }
    next();
  };
};

module.exports = { protect, authorize };
