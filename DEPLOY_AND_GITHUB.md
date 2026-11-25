# GitHub push steps
```
cd placement-portal
git init
git add .
git commit -m "chore: initial project structure"
git branch -M main
git remote add origin https://github.com/<username>/placement-portal.git
git push -u origin main
```
Check `.env` is NOT in the repo (.gitignore already blocks it).
Tip: make real, small commits as you test and change things (feat/fix/docs). Do not push one giant commit on the last day.

# Deployment (free tier)
| Part | Service | Settings |
|---|---|---|
| DB | MongoDB Atlas M0 | Create user, allow network access, copy URI into MONGO_URI |
| Backend | Render | Root dir `backend`, build `npm install`, start `npm start`, add all env vars |
| Frontend | Netlify / Vercel | Publish `frontend` folder (static) |

After deploy:
- Set `API_URL` in `frontend/js/api.js` to the Render URL + `/api/v1`
- Set `CLIENT_URL` on Render to the Netlify URL (CORS)
- Render free tier sleeps: first request can take ~1 minute (mention in README)
- Uploaded resumes on Render free disk are temporary; for production use Cloudinary/S3

# Manual test table (put results in README)
| Test | Expected |
|---|---|
| Register with existing email | 409 |
| Login wrong password | 401 |
| Open dashboard without login | Redirect to login |
| Student creates job | 403 |
| Upload non-PDF / >2 MB | 400 |
| Apply without resume | 400 |
| Recruiter edits other recruiter's job | 403 |
