const router = require('express').Router();
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const upload = require('../middlewares/upload.middleware');
const v = require('../validators');
const auth = require('../controllers/auth.controller');
const profile = require('../controllers/profile.controller');
const job = require('../controllers/job.controller');
const ref = require('../controllers/referral.controller');
const dash = require('../controllers/dashboard.controller');

router.post('/auth/register', v.registerRules, validate, auth.register);
router.post('/auth/login', v.loginRules, validate, auth.login);
router.get('/auth/me', protect, auth.getMe);

router.get('/profile', protect, restrictTo('student'), profile.getProfile);
router.put('/profile', protect, restrictTo('student'), profile.updateProfile);
router.post('/profile/resume', protect, restrictTo('student'), upload.single('resume'), profile.uploadResume);

router.get('/jobs/recommended', protect, restrictTo('student'), job.recommended);
router.get('/applications/mine', protect, restrictTo('student'), job.myApplications);
router.put('/applications/:id', protect, restrictTo('recruiter', 'admin'), job.updateApplication);
router.route('/jobs').get(protect, job.getJobs).post(protect, restrictTo('recruiter', 'admin'), v.jobRules, validate, job.createJob);
router.route('/jobs/:id').put(protect, restrictTo('recruiter', 'admin'), job.updateJob).delete(protect, restrictTo('recruiter', 'admin'), job.deleteJob);
router.post('/jobs/:id/apply', protect, restrictTo('student'), job.apply);
router.get('/jobs/:id/applicants', protect, restrictTo('recruiter', 'admin'), job.applicants);

router.get('/alumni', protect, restrictTo('student'), ref.alumniList);
router.route('/referrals').get(protect, restrictTo('student', 'alumni'), ref.mine).post(protect, restrictTo('student'), v.referralRules, validate, ref.request);
router.put('/referrals/:id', protect, restrictTo('alumni'), ref.respond);

router.get('/dashboard/stats', protect, restrictTo('admin', 'recruiter'), dash.stats);
router.get('/admin/users', protect, restrictTo('admin'), dash.users);
router.put('/admin/users/:id/toggle', protect, restrictTo('admin'), dash.toggleUser);
module.exports = router;
