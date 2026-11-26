const Referral = require('../models/Referral');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const asyncHandler = require('../utils/asyncHandler');

exports.alumniList = asyncHandler(async (req, res) => {
  const filter = { role: 'alumni', isActive: true }; if (req.query.company) filter.company = new RegExp(`^${req.query.company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  res.json({ success: true, data: await User.find(filter).select('name company') });
});
exports.request = asyncHandler(async (req, res) => {
  const alumni = await User.findOne({ _id: req.body.alumni, role: 'alumni' });
  if (!alumni) throw new ApiError(404, 'Alumni not found');
  const r = await Referral.create({ job: req.body.job, alumni: alumni._id, student: req.user._id, note: req.body.note });
  res.status(201).json({ success: true, message: 'Referral requested', data: r });
});
exports.mine = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'alumni' ? { alumni: req.user._id } : { student: req.user._id };
  const data = await Referral.find(filter).populate('job', 'title company').populate('student alumni', 'name').sort('-createdAt');
  res.json({ success: true, data });
});
exports.respond = asyncHandler(async (req, res) => {
  const r = await Referral.findById(req.params.id).populate('student', 'email name');
  if (!r) throw new ApiError(404, 'Referral not found');
  if (!r.alumni.equals(req.user._id)) throw new ApiError(403, 'Not allowed');
  if (!['accepted', 'rejected'].includes(req.body.status)) throw new ApiError(400, 'status must be accepted or rejected');
  r.status = req.body.status; await r.save();
  sendEmail(r.student.email, 'Referral update', `Your referral request was ${r.status}.`);
  res.json({ success: true, message: 'Referral updated', data: r });
});
