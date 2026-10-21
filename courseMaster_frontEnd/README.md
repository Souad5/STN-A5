# CourseMaster - Frontend
Live Link: https://course-master4981.netlify.app/

Video link: https://drive.google.com/file/d/1vjMrBxr0-7xqjxMX2EBEBw30D_av1pOu/view

A modern E-learning platform frontend built with React, Redux Toolkit, and Tailwind CSS.

Admin email: admin@coursemaster.com
Pass: admin123

## Project Name & Description

**CourseMaster** is a full-featured E-learning platform where students can browse, purchase, and consume courses. The frontend provides an intuitive interface for students to enroll in courses, watch video lectures, complete assignments, and take quizzes. Administrators can manage courses, track enrollments, review assignments, and view analytics through a dedicated admin dashboard.

This is the frontend application of the CourseMaster platform, built with modern React technologies and responsive design principles.

## Technology Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **Tailwind CSS + DaisyUI** - Styling
- **Axios** - HTTP client

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd courseMaster_frontEnd
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory (see `.env.example`)

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables (see `.env.example` for reference):

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000/api
# For production, use your deployed backend URL (ending in /api):
# VITE_API_BASE_URL=https://<your-backend-host>/api
```

Vite reads `.env` only at startup, so restart `npm run dev` after changing it. The committed `.env.example` points at a hosted backend; change it to the local URL for development.

## Quick Start (local)

The backend (`courseMaster_Backend`) must be running first.

```bash
npm install
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
npm run dev          # http://localhost:5173 (Vite uses the next free port if it is taken)
```

Demo accounts (created by the backend seed): `admin@coursemaster.com` / `admin123` and `student@coursemaster.com` / `student123`.

**Required Variables:**
- `VITE_API_BASE_URL` - The base URL of the backend API (required)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CourseCard/     # Course listing components
│   └── shared/         # Shared components (Navbar, Footer, Logo)
├── layouts/            # Layout components
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   ├── CoursePlayer/   # Course video player
│   ├── CousrseDetails/ # Course details page
│   ├── Home/           # Home page with course listing
│   ├── Login/          # Login page
│   ├── Register/       # Registration page
│   └── student/        # Student dashboard
├── routes/              # Route protection components
├── services/           # API service functions
├── store/              # Redux store and slices
└── utils/              # Utility functions
```

## Features

### Public Features
- Browse courses with pagination, search, sorting, and filtering
- View detailed course information
- User registration and login

### Student Features
- Enroll in courses
- Watch video lectures (YouTube integration)
- Mark lessons as complete
- Track learning progress
- Submit assignments (text or Google Drive links)
- Take quizzes with immediate score feedback
- View enrolled courses dashboard

### Admin Features
- Create, update, and delete courses
- Add course syllabus (modules, lessons, videos, assignments, quizzes)
- Manage course batches
- View all enrollments
- Review and grade student assignments
- Filter enrollments by course/student
- Filter assignments by status

## API Integration

The frontend communicates with the backend API. All API endpoints are documented in the backend README.

### Key API Endpoints Used:

- **Authentication**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Courses**: `/api/courses` (GET all, GET by ID)
- **Enrollments**: `/api/enrollments/:courseId` (POST), `/api/enrollments/my` (GET)
- **Assignments**: `/api/assignments/submit` (POST), `/api/assignments/my` (GET), `/api/assignments/stats` (GET)
- **Quizzes**: `/api/quizzes/submit` (POST), `/api/quizzes/my` (GET), `/api/quizzes/stats` (GET)
- **Admin**: `/api/admin/courses`, `/api/admin/enrollments`, `/api/admin/assignments`, `/api/admin/analytics`

For complete API documentation with request/response formats, see [courseMaster_Backend/README.md](../courseMaster_Backend/README.md).

## Bug fixes in this fork

This fork fixes 15 frontend bugs found during QA (IDs FE-01 to FE-15 in the bug report):

- **Auth and routing:** the token is saved and read under the same localStorage key, so login persists; the hardcoded-JWT "Dev Bypass" panel, the `dev_bypass` flag and the fail-open route fallback were removed; `ProtectedRoute` validates the session with the API and supports `requireAdmin`; the user profile is loaded after a page reload.
- **Pages that were broken:** My Courses no longer crashes (the enrollments reducer stored `payload.data`); the course price is no longer multiplied by 100; enrolling with a batch sends the batch `_id`; the course player video is responsive and completed lessons are detected; dashboard progress uses the saved percent instead of NaN%.
- **Admin:** the overview's Top Courses chart reads the real analytics fields and the fake "+12%" trend is gone; stale success/error banners are cleared when the course forms open; nested `<main>` landmarks fixed.
- **UI polish:** navbar highlights only the current page, the mobile menu is no longer clipped, and the dead Profile and About links were removed; the course search no longer sends a stale-page request; the course card uses valid markup and wraps long titles.

## Development

- Development server runs on `http://localhost:5173` (default Vite port)
- Hot Module Replacement (HMR) is enabled
- ESLint is configured for code quality (`npm run lint` still reports some pre-existing unused-variable errors)

## Deployment

The frontend can be deployed to:
- **Netlify**

