const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.stats = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const jobFilter = isAdmin ? {} : { postedBy: req.user._id };
  const jobIds = (await Job.find(jobFilter).select('_id')).map(j => j._id);
  const [byStatus, jobs, students] = await Promise.all([
    Application.aggregate([{ $match: { job: { $in: jobIds } } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Job.countDocuments(jobFilter),
    isAdmin ? User.countDocuments({ role: 'student' }) : null,
  ]);
  res.json({ success: true, data: { jobs, students, applicationsByStatus: byStatus } });
});
exports.users = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await User.find().select('name email role company isActive').sort('-createdAt') });
});
exports.toggleUser = asyncHandler(async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ success: false, message: 'User not found' });
  u.isActive = !u.isActive; await u.save();
  res.json({ success: true, data: { id: u._id, isActive: u.isActive } });
});
