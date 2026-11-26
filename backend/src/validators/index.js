const { body } = require('express-validator');
exports.registerRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['student', 'recruiter', 'alumni']).withMessage('Invalid role'),
];
exports.loginRules = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password required'),
];
exports.jobRules = [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('company').trim().notEmpty().withMessage('Company required'),
  body('requiredSkills').isArray({ min: 1 }).withMessage('requiredSkills must be a non-empty array'),
  body('minCGPA').optional().isFloat({ min: 0, max: 10 }).withMessage('minCGPA must be 0-10'),
];
exports.referralRules = [
  body('job').isMongoId().withMessage('Valid job id required'),
  body('alumni').isMongoId().withMessage('Valid alumni id required'),
];
