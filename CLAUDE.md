# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

A single git repo (`Souad5/STN-A5`) that holds both projects of the CourseMaster e-learning platform as plain folders:

- `courseMaster_Backend/` — Express 5 + Mongoose 9 REST API (CommonJS)
- `courseMaster_frontEnd/` — React 19 + Redux Toolkit + Vite 7 + Tailwind 4/DaisyUI SPA (ESM)

This repo is a snapshot of the fixed code. The same code (with full history) lives in the forks `Souad5/courseMaster_Backend` and `Souad5/courseMaster_frontEnd`, which come from `Pullock4981/*`. Never push to the Pullock4981 originals.

## Commands

Backend (`courseMaster_Backend/`):
- `npm run dev` — nodemon on `server.js`; `npm start` — plain node
- `npm run seed` — wipes users/courses/enrollments/submissions, then seeds demo data. Needs a running MongoDB.

Frontend (`courseMaster_frontEnd/`):
- `npm run dev` (Vite, default port 5173; it moves to the next free port if taken), `npm run build`, `npm run lint`

There is no test suite and no test runner configured in either repo. `npm run lint` already reports pre-existing errors (unused destructured vars, a hook-rule note in EditCourse), so compare against that baseline rather than expecting zero.

## Local setup

- Backend `.env` (git-ignored): `PORT=5000`, `MONGODB_URI`, `JWT_SECRET`, optional `ADMIN_REGISTRATION_KEY`, `NODE_ENV`, `FRONTEND_URL`, email vars. `.env.example` lists them. The server refuses to connect without `MONGODB_URI` (or `MONGO_URI`).
- Frontend `.env`: `VITE_API_BASE_URL=http://localhost:5000/api`. Vite reads it only at startup. The committed `.env.example` points at a production Vercel URL, so copy it and change it.
- No MongoDB is installed on this machine. A temporary one can be run with the `mongodb-memory-server` npm package (data dir `~/coursemaster-mongo-data`, port 27017).
- Seeded logins: `admin@coursemaster.com` / `admin123`, `student@coursemaster.com` / `student123`.
- READMEs show the base URL as `/api/api` and a wrong `cd` folder name; the real base URL is `/api`.

## Backend architecture

Layering is route → controller → service → model, one set per resource (auth, courses, admin, enrollments, assignments, quizzes, users), mounted in `app.js` under `/api/<resource>`. Controllers only wrap try/catch and map errors to status codes; business rules live in `src/services/`.

- `app.js` exports the Express app without listening. `server.js` listens locally; `api/index.js` re-exports `app` as the Vercel serverless entry (`vercel.json` routes everything to it). `db.js` caches the Mongoose connection, and an Express middleware re-awaits `connectDB()` per request for serverless.
- Auth: `authMiddleware` verifies the JWT, then reloads the user from the DB so deleted or banned accounts are rejected and `req.user.role` comes from the DB, not the token. Admin routes chain `authMiddleware` then `adminMiddleware`. Passwords use bcrypt; admin sign-up is granted only when `adminKey` equals `ADMIN_REGISTRATION_KEY`.
- Course content is embedded: `Course.syllabus[].lessons[]` hold videos, assignment prompts, quiz questions (with `correctIndex`) and live-class links. Enrollment progress stores lesson `_id`s; services find lessons with `mod.lessons.id(lessonId)`. Batches are subdocuments with an `_id`; `Enrollment.batchId` must be an ObjectId taken from a batch.
- Deleting a user or course cascades to enrollments, assignment submissions and quiz submissions in the service layer (no DB-level cascade).
- Analytics (`admin.service.js`) buckets enrollments by UTC day; keep both the key and the label in UTC.
- Errors: services throw `Error` with a message; most controllers return 400/404 with `{ message }`. `errorMiddleware` only handles errors passed to `next`.

## Frontend architecture

- `src/services/api.js` is the single axios instance (base URL from `VITE_API_BASE_URL`). A request interceptor sends the token from localStorage key `token`, and a 401 response clears it and hard-redirects to `/login`. Other `src/services/*.api.js` files are thin endpoint wrappers.
- Token helpers are in `src/utils/auth.js`; use them rather than touching localStorage directly.
- Redux slices in `src/store/slices` (auth, courses, enrollment, admin) use `createAsyncThunk` with `rejectWithValue(err.response?.data?.message)`. Some pages skip Redux and call the services directly (Login, Register, CoursesSection, CoursePlayer sub-components, ManageUsers).
- Routing is in `App.jsx`: public pages, plus `ProtectedRoute` for `/student`, `/courses/:id/player` and `/admin`. `ProtectedRoute` validates the token with `/auth/me` and takes `requireAdmin`. Heavy pages are lazy-loaded.
- The app shell is `layouts/MainLayout.jsx`, which loads the user profile and enrollments once a token exists. Admin pages render inside `pages/admin/components/AdminDashboard.jsx` (sidebar plus `<Outlet/>`).
- Course player: progress, completed lessons, quiz and assignment submissions all come from the backend; lesson ids are compared as strings.
