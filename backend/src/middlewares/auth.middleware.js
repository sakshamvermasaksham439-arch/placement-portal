const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
  const h = req.headers.authorization;
  const token = h && h.startsWith('Bearer ') ? h.split(' ')[1] : null;
  if (!token) throw new ApiError(401, 'Not authorized, token missing');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw new ApiError(401, 'User no longer exists');
  req.user = user;
  next();
});
exports.restrictTo = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : next(new ApiError(403, 'Access denied'));
