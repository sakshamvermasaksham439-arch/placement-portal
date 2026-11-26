const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['student', 'recruiter', 'alumni', 'admin'], default: 'student' },
  company: { type: String, trim: true },            // recruiter / alumni
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.matchPassword = function (plain) { return bcrypt.compare(plain, this.password); };
module.exports = mongoose.model('User', userSchema);
