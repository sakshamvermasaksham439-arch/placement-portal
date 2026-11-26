require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Create demo users
    const demoUsers = [
      { name: 'TPO Admin', email: 'admin@demo.com', password: 'Admin@123', role: 'admin' },
      { name: 'Recruiter Ravi', email: 'recruiter@demo.com', password: 'Recruit@123', role: 'recruiter', company: 'Acme Tech' },
      { name: 'Alumni Anita', email: 'alumni@demo.com', password: 'Alumni@123', role: 'alumni', company: 'Acme Tech' }
    ];

    for (const u of demoUsers) {
      if (!(await User.findOne({ email: u.email }))) {
        await User.create(u);
      }
    }

    const recruiter = await User.findOne({
      email: 'recruiter@demo.com'
    });

    // Create demo jobs
    const jobs = [
      {
        title: 'Java Developer',
        company: 'Acme Tech',
        description: 'Java backend development opportunity.',
        requiredSkills: ['Java', 'SQL', 'Spring Boot'],
        minCGPA: 0,
        status: 'approved',
        postedBy: recruiter._id
      },
      {
        title: 'Python Developer',
        company: 'Tech Solutions',
        description: 'Python development and data processing.',
        requiredSkills: ['Python', 'SQL', 'Pandas', 'NumPy'],
        minCGPA: 0,
        status: 'approved',
        postedBy: recruiter._id
      },
      {
        title: 'Frontend Developer',
        company: 'Web Creators',
        description: 'Frontend development using modern web technologies.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript'],
        minCGPA: 0,
        status: 'approved',
        postedBy: recruiter._id
      }
    ];

    for (const job of jobs) {
      const exists = await Job.findOne({
        title: job.title,
        company: job.company
      });

      if (!exists) {
        await Job.create(job);
      }
    }

    console.log('Seeded demo users and demo jobs successfully!');
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
})();