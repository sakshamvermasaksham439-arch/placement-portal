const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  company: { type: String, required: true, trim: true },
  description: { type: String, trim: true, maxlength: 3000 },
  requiredSkills: [String],
  minCGPA: { type: Number, default: 0 },
  allowedBranches: [String],   // empty = all branches
  deadline: Date,
  status: { type: String, enum: ['pending', 'approved', 'closed'], default: 'pending' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
schema.index({ title: 'text', company: 'text', description: 'text' });
module.exports = mongoose.model('Job', schema);
