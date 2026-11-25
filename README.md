# Campus Placement & Referral Portal (Auto-Resume Matcher)
MERN-style full-stack project (HTML/CSS/JS frontend + Node/Express + MongoDB).

## Features
- [x] JWT auth, bcrypt hashing, 4 roles: student / recruiter / alumni / admin (TPO)
- [x] Job CRUD with ownership checks; recruiter jobs need admin approval
- [x] Resume upload (PDF, 2 MB) -> text parsing -> skill extraction
- [x] **Auto-Resume Matcher**: weighted skill overlap + TF-IDF blend, matched / missing skills (skill gap)
- [x] Eligibility filter (CGPA, branch), recommended jobs sorted by match score
- [x] Apply + recruiter view of applicants ranked by `-matchScore`, status updates
- [x] Referral requests (student -> alumni), accept / reject
- [x] Admin dashboard: stats aggregation, job approval, user activate/deactivate
- [x] Pagination, search, skill/CGPA filter, validation, central error handler
- [x] helmet, CORS, rate limit, mongo-sanitize, body limit
- [x] Email notifications (nodemailer, optional SMTP)
- [x] Jest + Supertest API tests, Docker + docker-compose, GitHub Actions CI
- [ ] Planned: Socket.io alerts

## Matcher formula
`score = sum(weight of matched required skills) / sum(weight of required skills) * 100`
Final = 0.8 * skillScore + 0.2 * TF-IDF cosine(resume, job description) * 100 (when a description exists).

## Getting started
1. `cd backend && npm install && cp .env.example .env` (fill values)
2. `npm run seed` (demo: admin@demo.com / Admin@123, recruiter@demo.com / Recruit@123, alumni@demo.com / Alumni@123, demo data only)
3. `npm run dev` (API on :5000)
4. Open `frontend/login.html` with VS Code Live Server. Set `CLIENT_URL` in `.env` to that origin (usually `http://127.0.0.1:5500`).
5. `npm test` for matcher tests.

## API (/api/v1)
| Method | Endpoint | Access |
|---|---|---|
| POST | /auth/register, /auth/login | Public |
| GET | /auth/me | Private |
| GET/PUT | /profile | Student |
| POST | /profile/resume (field `resume`) | Student |
| GET | /jobs/recommended | Student |
| GET/POST | /jobs | Private / Recruiter, Admin |
| PUT/DELETE | /jobs/:id | Owner / Admin |
| POST | /jobs/:id/apply | Student |
| GET | /jobs/:id/applicants?sort=-matchScore | Recruiter, Admin |
| PUT | /applications/:id | Recruiter, Admin |
| GET | /applications/mine | Student |
| GET | /alumni | Student |
| GET/POST | /referrals | Student, Alumni |
| PUT | /referrals/:id | Alumni |
| GET | /dashboard/stats | Admin, Recruiter |
| GET | /admin/users, PUT /admin/users/:id/toggle | Admin |

## Structure
```
backend/src/{config,models,controllers,routes,middlewares,validators,services,utils}
frontend/{login,register,dashboard,resume}.html + css/ + js/api.js
```

## Tests, Docker, deploy
- `cd backend && npm test` (needs MongoDB running, uses `MONGO_URI_TEST`)
- `docker compose up --build` starts MongoDB + API
- See `DEPLOY_AND_GITHUB.md` for GitHub push and Render/Netlify steps
- Optional SMTP vars in `.env.example` enable emails; otherwise emails are only logged
