const Job = require('../models/Job');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const asyncHandler = require('../utils/asyncHandler');
const { matchResume, checkEligibility, normalizeSkill } = require('../services/matcher.service');

exports.createJob = asyncHandler(async (req, res) => {
  const { title, company, description, requiredSkills, minCGPA, allowedBranches, deadline } = req.body;
  const job = await Job.create({ title, company, description, minCGPA, allowedBranches, deadline,
    requiredSkills: requiredSkills.map(normalizeSkill), postedBy: req.user._id,
    status: req.user.role === 'admin' ? 'approved' : 'pending' });   // recruiter jobs need TPO approval
  res.status(201).json({ success: true, message: 'Job created', data: job });
});

exports.getJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, skill, minCGPA, sort = '-createdAt' } = req.query;
  const filter = {};
  if (req.user.role === 'recruiter') filter.postedBy = req.user._id;
  else if (req.user.role !== 'admin') filter.status = 'approved';
  if (search) filter.$text = { $search: search };
  if (skill) filter.requiredSkills = normalizeSkill(skill);
  if (minCGPA) filter.minCGPA = { $lte: Number(minCGPA) };
  const skip = (Number(page) - 1) * Number(limit);
  const [jobs, total] = await Promise.all([
    Job.find(filter).sort(sort.split(',').join(' ')).skip(skip).limit(Number(limit)), Job.countDocuments(filter)]);
  res.json({ success: true, data: jobs, pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) } });
});

async function ownedJob(req) {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');
  if (!job.postedBy.equals(req.user._id) && req.user.role !== 'admin') throw new ApiError(403, 'Not allowed');
  return job;
}
exports.updateJob = asyncHandler(async (req, res) => {
  const job = await ownedJob(req);
  ['title', 'company', 'description', 'minCGPA', 'allowedBranches', 'deadline'].forEach(k => { if (req.body[k] !== undefined) job[k] = req.body[k]; });
  if (req.body.requiredSkills) job.requiredSkills = req.body.requiredSkills.map(normalizeSkill);
  if (req.body.status && req.user.role === 'admin') job.status = req.body.status;   // only admin approves/closes
  await job.save();
  res.json({ success: true, message: 'Job updated', data: job });
});
exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await ownedJob(req); await job.deleteOne();
  res.json({ success: true, message: 'Job deleted' });
});

// Recommended jobs sorted by matchScore (eligibility filter first)
exports.recommended = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id }).select('+parsedText');
  if (!profile?.resumeUrl) throw new ApiError(400, 'Upload your resume first');
  const jobs = await Job.find({ status: 'approved', $or: [{ deadline: null }, { deadline: { $gte: new Date() } }] });
  const data = jobs.filter(j => checkEligibility(profile, j).ok)
    .map(j => ({ job: j, ...matchResume(profile, j) })).sort((a, b) => b.matchScore - a.matchScore);
  res.json({ success: true, data });
});

exports.apply = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job || job.status !== 'approved') throw new ApiError(404, 'Job not available');
  if (job.deadline && job.deadline < new Date()) throw new ApiError(400, 'Deadline passed');
  const profile = await StudentProfile.findOne({ user: req.user._id }).select('+parsedText');
  if (!profile?.resumeUrl) throw new ApiError(400, 'Upload your resume first');
  const elig = checkEligibility(profile, job);
  if (!elig.ok) throw new ApiError(403, elig.reason);
  const app = await Application.create({ job: job._id, student: req.user._id, ...matchResume(profile, job) });
  sendEmail(req.user.email, `Applied: ${job.title}`, `Hi ${req.user.name}, you applied to ${job.title} at ${job.company}. Match score: ${app.matchScore}%.`);
  res.status(201).json({ success: true, message: 'Applied', data: app });
});

exports.applicants = asyncHandler(async (req, res) => {
  const job = await ownedJob(req);
  const { sort = '-matchScore' } = req.query;
  const apps = await Application.find({ job: job._id }).sort(sort.split(',').join(' ')).populate('student', 'name email');
  res.json({ success: true, data: apps });
});
exports.updateApplication = asyncHandler(async (req, res) => {
  const app = await Application.findById(req.params.id).populate('job').populate('student', 'name email');
  if (!app) throw new ApiError(404, 'Application not found');
  if (!app.job.postedBy.equals(req.user._id) && req.user.role !== 'admin') throw new ApiError(403, 'Not allowed');
  if (!['applied', 'shortlisted', 'rejected', 'selected'].includes(req.body.status)) throw new ApiError(400, 'Invalid status');
  app.status = req.body.status; await app.save();
  sendEmail(app.student.email, `Application update: ${app.job.title}`, `Your application status is now: ${app.status}.`);
  res.json({ success: true, message: 'Status updated', data: app });
});
exports.myApplications = asyncHandler(async (req, res) => {
  const apps = await Application.find({ student: req.user._id }).populate('job', 'title company').sort('-createdAt');
  res.json({ success: true, data: apps });
});
