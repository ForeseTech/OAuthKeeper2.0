const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc       Render Form For User Registration
// @route      GET /register
// @access     Public
const renderRegister = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});

// @desc       Register A User
// @route      POST /register
// @access     Public
const registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  // Create Token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
  });
});

// @desc       Render Form For User Login
// @route      GET /login
// @access     Public
const renderLogin = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});

// @desc       Login A User
// @route      POST /login
// @access     Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input email and password
  // We need to validate as login info is not validated against the model
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');

  // Check if user exists
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Create a token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
  });
});

module.exports = {
  renderRegister,
  registerUser,
  renderLogin,
  loginUser,
};
