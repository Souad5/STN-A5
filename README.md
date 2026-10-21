# STN-A5: CourseMaster

CourseMaster is an e-learning platform: students browse and enrol in courses, watch lessons, take quizzes and submit assignments; admins manage courses, users, enrollments and grading, and see analytics.

This repo holds both parts, with the bugs found during QA fixed:

| Folder | What it is | Stack |
| --- | --- | --- |
| [`courseMaster_Backend`](courseMaster_Backend) | REST API | Node, Express 5, MongoDB (Mongoose 9), JWT, bcrypt, Zod |
| [`courseMaster_frontEnd`](courseMaster_frontEnd) | Web app | React 19, Redux Toolkit, Vite 7, Tailwind 4, DaisyUI |

Each folder has its own README with details and a list of the fixes (31 in total: 16 backend, 15 frontend).

## Run it locally

You need Node 20+ and a MongoDB (local install or a MongoDB Atlas connection string).

```bash
# 1. backend
cd courseMaster_Backend
npm install
cp .env.example .env        # set MONGODB_URI and JWT_SECRET
npm run seed                # demo data (wipes the target database first)
npm run dev                 # http://localhost:5000

# 2. frontend (new terminal)
cd courseMaster_frontEnd
npm install
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
npm run dev                 # http://localhost:5173
```

Demo accounts created by the seed:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@coursemaster.com | admin123 |
| Student | student@coursemaster.com | student123 |

## Where the code comes from

The original projects are [Pullock4981/courseMaster_Backend](https://github.com/Pullock4981/courseMaster_Backend) and [Pullock4981/courseMaster_frontEnd](https://github.com/Pullock4981/courseMaster_frontEnd). The fixes, with commit history, are in the forks [Souad5/courseMaster_Backend](https://github.com/Souad5/courseMaster_Backend) and [Souad5/courseMaster_frontEnd](https://github.com/Souad5/courseMaster_frontEnd). This repo is a snapshot of those forks' `main` branches.
