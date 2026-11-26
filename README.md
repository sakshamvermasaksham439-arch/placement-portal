# Campus Placement & Referral Portal (Auto-Resume Matcher)
MERN-style full-stack project (HTML/CSS/JS frontend + Node/Express + MongoDB).

A full-stack Campus Placement & Referral Portal designed to streamline campus recruitment by connecting students, recruiters, alumni, and administrators through an intelligent resume-matching system.

The platform automatically analyzes resumes, extracts candidate skills, calculates job compatibility scores, identifies skill gaps, and recommends relevant placement opportunities.

<p align="center">
  **Smart Recruitment | Automated Resume Matching | Career Opportunities**
</p>---

🚀 Key Features

🔐 Authentication & Security

- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control (Student, Recruiter, Alumni, Admin)
- Secure API endpoints
- Rate limiting and request validation

📄 Resume Management

- PDF resume upload (maximum 2 MB)
- Automatic resume text extraction
- Skill extraction from resumes
- Resume profile management

🤖 Auto-Resume Matcher

- Weighted skill-overlap algorithm
- TF-IDF-based text similarity
- Automatic resume-job compatibility score
- Matched and missing skills identification
- Skill gap analysis
- Recommended jobs sorted by match score

💼 Job & Application Management

- Job creation, updating and deletion
- Admin approval for recruiter job postings
- Eligibility filtering based on CGPA and branch
- Online job applications
- Applicant ranking based on match score
- Application status updates

🤝 Alumni Referral System

- Student-to-alumni referral requests
- Accept or reject referral requests
- Referral management

📊 Admin Dashboard

- Dashboard statistics and aggregation
- Job approval management
- User activation and deactivation
- Centralized platform management

⚙️ Additional Features

- Pagination and search
- Skill and CGPA filters
- Input validation
- Centralized error handling
- Email notifications using Nodemailer
- Jest and Supertest API testing
- Docker and Docker Compose
- GitHub Actions CI

---

🧠 Resume Matching Algorithm

The Auto-Resume Matcher combines weighted skill matching and TF-IDF cosine similarity to evaluate candidate-job compatibility.

Skill Matching Formula

Skill Score =
(Sum of weights of matched required skills
 / Sum of weights of required skills) × 100

Final Matching Score

Final Score =
0.8 × Skill Score
+ 0.2 × TF-IDF Cosine Similarity × 100

The TF-IDF component is included when a job description exists.

Matching Results:

- Overall compatibility score
- Matched skills
- Missing skills
- Skill gap identification
- Job recommendations

---

🛠️ Technology Stack

Category| Technologies
Frontend| HTML5, CSS3, JavaScript
Backend| Node.js, Express.js
Database| MongoDB
Authentication| JWT, bcrypt
Resume Processing| PDF Text Parsing
Matching Algorithm| Weighted Skill Matching, TF-IDF
Email Service| Nodemailer
Testing| Jest, Supertest
Security| Helmet, CORS, Rate Limiting, Mongo Sanitize
Containerization| Docker, Docker Compose
CI/CD| GitHub Actions
Version Control| Git, GitHub

---

📂 Project Structure

placement-portal/
│
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── resume.html
│   ├── css/
│   └── js/
│       └── api.js
│
├── backend/
│   └── src/
│       ├── config/
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       ├── middlewares/
│       ├── validators/
│       ├── services/
│       └── utils/
│
├── .gitignore
├── README.md
├── DEPLOY_AND_GITHUB.md
├── docker-compose.yml
└── package-lock.json

---

⚡ Getting Started

Prerequisites

- Node.js and npm
- MongoDB
- Git
- VS Code
- Live Server extension

1. Clone Repository

git clone https://github.com/sakshamvermasaksham439-arch/placement-portal.git

2. Navigate to Backend

cd placement-portal/backend

3. Install Dependencies

npm install

4. Configure Environment Variables

Copy the example environment file:

cp .env.example .env

Configure the required MongoDB connection, JWT settings, client URL and other environment variables.

5. Seed Demo Data

npm run seed

Demo accounts:

Role| Email| Password
Admin| admin@demo.com| Admin@123
Recruiter| recruiter@demo.com| Recruit@123
Alumni| alumni@demo.com| Alumni@123

Note: Demo credentials are for local development only. Change or remove them before production use.

6. Start Backend Server

npm run dev

Backend API runs on:

http://localhost:5000

7. Start Frontend

Open:

frontend/login.html

Use the VS Code Live Server extension.

Configure "CLIENT_URL" in ".env" to match the Live Server origin, usually:

http://127.0.0.1:5500

---

🔗 API Documentation

Base URL:

/api/v1

Method| Endpoint| Access
POST| /auth/register| Public
POST| /auth/login| Public
GET| /auth/me| Private
GET/PUT| /profile| Student
POST| /profile/resume| Student
GET| /jobs/recommended| Student
GET/POST| /jobs| Private / Recruiter / Admin
PUT/DELETE| /jobs/:id| Owner / Admin
POST| /jobs/:id/apply| Student
GET| /jobs/:id/applicants| Recruiter / Admin
PUT| /applications/:id| Recruiter / Admin
GET| /applications/mine| Student
GET| /alumni| Student
GET/POST| /referrals| Student / Alumni
PUT| /referrals/:id| Alumni
GET| /dashboard/stats| Admin / Recruiter
GET| /admin/users| Admin
PUT| /admin/users/:id/toggle| Admin

---

🧪 Testing

Run API and matcher tests:

cd backend
npm test

Testing requires MongoDB to be running and "MONGO_URI_TEST" to be configured.

Testing tools:

- Jest
- Supertest

---

🐳 Docker Setup

Run the application using Docker Compose:

docker compose up --build

This starts MongoDB and the API services configured in Docker Compose.

---

📧 Email Notifications

The project supports email notifications through Nodemailer.

Configure optional SMTP environment variables in ".env.example" to enable email delivery.

Without SMTP configuration, email notifications are logged instead.

---

🔮 Future Enhancements

- [ ] Real-time notifications using Socket.io
- [ ] Advanced AI-based resume recommendations
- [ ] Enhanced placement analytics
- [ ] Additional recruiter-student communication features

---

🌐 Deployment

For GitHub publishing and deployment instructions, refer to:

"DEPLOY_AND_GITHUB.md"

The project includes deployment guidance for Render and Netlify.

---

👨‍💻 Author

Saksham Verma

B.Tech CSE (Data Science & AI) Student

- GitHub: "Saksham Verma" (https://github.com/sakshamvermasaksham439-arch)
- LinkedIn: "Connect on LinkedIn" (https://www.linkedin.com/in/saksham-verma-b64311349/)

---

⭐ Support

If you find this project useful or interesting, consider giving it a ⭐ on GitHub.

Built with ❤️ to make campus recruitment smarter and more efficient.
