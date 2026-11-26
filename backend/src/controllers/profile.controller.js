const fs = require('fs');
const pdf = require('pdf-parse');
const StudentProfile = require('../models/StudentProfile');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { extractSkills } = require('../services/matcher.service');

exports.getProfile = asyncHandler(async (req, res) => {
  const p = await StudentProfile.findOne({ user: req.user._id });
  res.json({ success: true, data: p });
});
exports.updateProfile = asyncHandler(async (req, res) => {
  const { branch, cgpa } = req.body;
  const p = await StudentProfile.findOneAndUpdate({ user: req.user._id },
    { ...(branch !== undefined && { branch }), ...(cgpa !== undefined && { cgpa }) }, { new: true, runValidators: true });
  res.json({ success: true, message: 'Profile updated', data: p });
});
exports.uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Resume PDF is required (field name: resume)');
  const parsed = await pdf(fs.readFileSync(req.file.path));
  const skills = extractSkills(parsed.text);
  const p = await StudentProfile.findOneAndUpdate({ user: req.user._id },
    { resumeUrl: req.file.filename, parsedText: parsed.text, skills }, { new: true });
  res.json({ success: true, message: 'Resume parsed', data: { resumeUrl: p.resumeUrl, skills } });
});
