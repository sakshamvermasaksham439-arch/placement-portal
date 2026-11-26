const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  branch: { type: String, trim: true },
  cgpa: { type: Number, min: 0, max: 10, default: 0 },
  skills: [String],            // extracted from resume (normalised)
  resumeUrl: String,
  parsedText: { type: String, select: false },
}, { timestamps: true });
module.exports = mongoose.model('StudentProfile', schema);
