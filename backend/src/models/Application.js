const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'selected'], default: 'applied' },
  matchScore: { type: Number, default: 0 },
  matchedSkills: [String],
  missingSkills: [String],
}, { timestamps: true });
schema.index({ job: 1, student: 1 }, { unique: true });   // one application per job
module.exports = mongoose.model('Application', schema);
