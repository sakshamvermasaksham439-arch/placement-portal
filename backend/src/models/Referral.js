const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  alumni: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['requested', 'accepted', 'rejected'], default: 'requested' },
  note: { type: String, maxlength: 500 },
}, { timestamps: true });
schema.index({ job: 1, alumni: 1, student: 1 }, { unique: true });
module.exports = mongoose.model('Referral', schema);
