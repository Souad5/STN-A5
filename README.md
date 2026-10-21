# STN-A5: CourseMaster

CourseMaster is a full-stack e-learning platform. Students browse and enrol in courses, watch video lessons, take quizzes, submit assignments and track their progress. Admins manage courses, users and enrollments, grade assignments and watch analytics.

This repo is the description and index of the project. The code and the QA work live on separate branches:

| Branch | What is on it |
| --- | --- |
| [`frontend`](../../tree/frontend) | The web app (React 19, Redux Toolkit, Vite 7, Tailwind 4, DaisyUI), with 15 bug fixes |
| [`backend`](../../tree/backend) | The REST API (Node, Express 5, MongoDB/Mongoose 9, JWT), with 16 bug fixes |
| [`problem-solving`](../../tree/problem-solving) | The QA bug report: 31 bugs with steps, expected vs actual, fixes and verification |
| `main` (this branch) | The project description |

## Features

**Public**
- Browse courses with pagination, search, price sorting, and category and tag filters
- Course details with syllabus, tags and batches
- Registration and login

**Students**
- Enrol in a course, optionally in a batch
- Watch YouTube video lessons and mark lessons complete
- Take quizzes with an immediate score
- Submit assignments as text or a link; see grades and feedback
- Dashboard with progress, quiz average and assignment average per course

**Admins**
- Create, edit and delete courses (modules, lessons, videos, quizzes, assignment prompts, live-class links, batches)
- View and filter enrollments
- Review and grade assignments
- Manage users: change role, ban or unban, delete
- Analytics: enrollments over the last 30 days, top courses, platform totals

**Extras:** welcome email on registration (optional, via Nodemailer), dark and light theme, role-based access, responsive layout.

## How it fits together

```
Browser (React SPA)  --HTTPS/JSON-->  Express API  --Mongoose-->  MongoDB
   Redux Toolkit                        JWT auth, Zod
   axios (token in localStorage)        route > controller > service > model
```

- **Frontend:** one axios instance sends the JWT (`Authorization` header). Redux slices hold auth, courses, enrollments and admin data. `ProtectedRoute` validates the session with `/api/auth/me` and can require the admin role.
- **Backend:** each resource (auth, courses, admin, enrollments, assignments, quizzes, users) has routes, a controller and a service. The auth middleware verifies the JWT and reloads the user so banned or deleted accounts lose access immediately. Course content (modules, lessons, quizzes) is embedded in the Course document. The same app runs locally and as a Vercel serverless function.
- **Data:** Users, Courses, Enrollments (with progress), Assignment submissions and Quiz submissions.

## API at a glance

Base path `/api`.

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Courses (public) | `GET /courses` (page, limit, search, sort, category, tags), `GET /courses/:id` |
| Enrollments | `POST /enrollments/:courseId`, `GET /enrollments/my`, `PATCH /enrollments/:enrollId/complete-lesson` |
| Assignments | `POST /assignments/submit`, `GET /assignments/my`, `GET /assignments/stats` |
| Quizzes | `POST /quizzes/submit`, `GET /quizzes/my`, `GET /quizzes/stats` |
| Admin | `/admin/courses` (create, update, delete), `/admin/enrollments`, `/admin/assignments`, `/admin/assignments/:id/review`, `/admin/analytics` |
| Users (admin) | `GET /users`, `DELETE /users/:id`, `PATCH /users/:id/role`, `PATCH /users/:id/ban` |

## Run it locally

You need Node 20+ and a MongoDB (local install or a MongoDB Atlas connection string). Get the code from the `backend` and `frontend` branches.

```bash
# backend branch
cd courseMaster_Backend
npm install
cp .env.example .env        # set MONGODB_URI and JWT_SECRET
npm run seed                # demo data (wipes the target database first)
npm run dev                 # http://localhost:5000

# frontend branch (new terminal)
cd courseMaster_frontEnd
npm install
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
npm run dev                 # http://localhost:5173
```

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@coursemaster.com | admin123 |
| Student | student@coursemaster.com | student123 |

These are demo accounts created by the seed script.

## Problem solving (QA summary)

The starting code contained deliberate and accidental bugs. They were found by running the original and the fixed code side by side, reproduced, fixed and re-tested. Details are in `BUG-REPORT.md` on the `problem-solving` branch.

| Severity | Count | Examples |
| --- | --- | --- |
| Critical | 6 | login always failed (plaintext password compare); invalid JWTs accepted; first enrollment always failed; login not persisted (token key mismatch); My Courses crashed; hardcoded admin token and bypass backdoor |
| High | 5 | banned users kept access; lessons completable on others' enrollments; quiz percent off by 10x; price shown 100x; enrolling with a batch failed |
| Medium | 11 | admin filter ignored; search crashed on `(`; missing validation; analytics timezone; orphaned records; video size; and others |
| Low | 9 | dead links, markup warnings, config template, latent code issues |

## Where the code comes from

Original projects: [Pullock4981/courseMaster_Backend](https://github.com/Pullock4981/courseMaster_Backend) and [Pullock4981/courseMaster_frontEnd](https://github.com/Pullock4981/courseMaster_frontEnd). The fixes, with full commit history, are in the forks [Souad5/courseMaster_Backend](https://github.com/Souad5/courseMaster_Backend) and [Souad5/courseMaster_frontEnd](https://github.com/Souad5/courseMaster_frontEnd).
