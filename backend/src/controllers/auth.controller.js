const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const out = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, company } = req.body;
  if (await User.findOne({ email })) throw new ApiError(409, 'Email already registered');
  const user = await User.create({ name, email, password, company, role: role || 'student' }); // admin can never be self-assigned
  if (user.role === 'student') await StudentProfile.create({ user: user._id });
  res.status(201).json({ success: true, message: 'Registered', data: { token: generateToken(user._id), user: out(user) } });
});
exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !user.isActive || !(await user.matchPassword(req.body.password))) throw new ApiError(401, 'Invalid email or password');
  res.json({ success: true, data: { token: generateToken(user._id), user: out(user) } });
});
exports.getMe = asyncHandler(async (req, res) => res.json({ success: true, data: req.user }));
