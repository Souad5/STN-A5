# CourseMaster QA Bug Report

31 bugs found across the backend (`BE-`) and frontend (`FE-`). All are fixed and verified locally.

**Method.** The original code (git HEAD of the Pullock4981 repos) was run next to the fixed code against a local MongoDB seeded with `npm run seed`. Backend bugs were reproduced with a 35-check API script (original: 17 failed; fixed: all pass). Frontend bugs were reproduced in Chrome using the original and the fixed frontend against the same backend, so each difference comes from the frontend change alone. Where a bug is latent or only confirmed from the code path, it says so.

**Severity:** Critical = app unusable or security hole; High = major feature broken; Medium = wrong behaviour with a workaround; Low = cosmetic or latent. **Priority:** P0 fix now, P1 this release, P2 next release, P3 backlog.

| ID | Bug | Severity | Priority |
| --- | --- | --- | --- |
| BE-01 | Valid password rejected (plaintext compare instead of bcrypt) | Critical | P0 |
| BE-02 | Invalid or expired JWT lets the request through the auth middleware | Critical | P0 |
| BE-03 | Banned or deleted users keep access with their old token | High | P1 |
| BE-04 | Admin registration key never grants the admin role | Medium | P2 |
| BE-05 | Enrollment check inverted: first enrollment always fails | Critical | P0 |
| BE-06 | Any user can mark lessons complete on another student's enrollment | High | P1 |
| BE-07 | Lesson completion saved without await (latent race) | Low | P3 |
| BE-08 | Quiz percentage multiplied by 10 instead of 100 | High | P1 |
| BE-09 | Admin assignment list ignores the course filter | Medium | P2 |
| BE-10 | Course search returns HTTP 400 for regex characters such as "(" | Medium | P2 |
| BE-11 | Missing server-side validation (price, grade, status, answers) | Medium | P2 |
| BE-12 | Analytics chart shows zero enrollments (timezone mismatch) | Medium | P2 |
| BE-13 | Deleting a user or course leaves orphaned records | Medium | P2 |
| BE-14 | Invalid course id returns a raw Mongoose cast error | Low | P3 |
| BE-15 | Backend `.env.example` contains the frontend variables | Low | P3 |
| BE-16 | Misleading CORS Allow-Methods override (latent) | Low | P3 |
| FE-01 | Login does not persist: token saved and read under different keys | Critical | P0 |
| FE-02 | My Courses page crashes to a blank screen | Critical | P0 |
| FE-03 | Dev-bypass backdoor and hardcoded admin JWT in the login page | Critical | P0 |
| FE-04 | Course price shown 100 times too high | High | P1 |
| FE-05 | Enrolling with a batch selected fails | High | P1 |
| FE-06 | Course player video is 300 x 700 px | Medium | P2 |
| FE-07 | Completed lessons are never detected in the player | Medium | P2 |
| FE-08 | Dashboard progress shows NaN% before details are opened | Medium | P2 |
| FE-09 | Admin overview: Top Courses chart never renders, fake +12% trend | Medium | P2 |
| FE-10 | Admin user profile not loaded after a page reload | Low | P3 |
| FE-11 | Navbar: every link looks active, mobile menu clipped, dead Profile link | Medium | P3 |
| FE-12 | Searching from page 2 sends a stale-page request | Low | P3 |
| FE-13 | Course card: invalid HTML nesting and unwrapped titles | Low | P3 |
| FE-14 | Footer links to a non-existent About page | Low | P3 |
| FE-15 | Nested main landmarks in the admin layout | Low | P3 |

## Backend

### BE-01 Valid password rejected (Critical, P0)
- **Steps:** `POST /api/auth/login` with `admin@coursemaster.com` / `admin123`.
- **Expected:** 200 and a JWT. **Actual:** 400 "Invalid email or password"; the code compared the typed password with the stored bcrypt hash using `===`, so nobody could log in.
- **Fix:** `bcrypt.compare`, normalised email, banned users rejected. **Verified:** right password gives 200, wrong password 400.

### BE-02 Invalid JWT passes the auth middleware (Critical, P0)
- **Steps:** `GET /api/auth/me` with `Authorization: Bearer garbage`.
- **Expected:** 401. **Actual:** the `catch` called `next()`, the request continued with no user, and returned 404 `Cannot read properties of undefined (reading 'id')`.
- **Fix:** return 401 "Invalid or expired token". **Verified:** 401 on `/auth/me` and `/users`.

### BE-03 Banned or deleted users keep access (High, P1)
- **Steps:** log in as a student and keep the token; as admin, ban or delete that user; call `/api/auth/me` with the old token.
- **Expected:** 403 (banned) or 401 (deleted). **Actual:** 200 for the banned user and a 404 error for the deleted one. Banned users could also log in.
- **Fix:** the middleware reloads the user on every request, rejects missing or banned accounts and takes the role from the DB; login refuses banned users. **Verified:** banned login blocked, old tokens rejected.

### BE-04 Admin registration key never grants admin (Medium, P2)
- **Steps:** `POST /api/auth/register` with `adminKey` equal to `ADMIN_REGISTRATION_KEY`.
- **Expected:** role admin; a wrong key is rejected. **Actual:** role always student; a wrong key was accepted silently. The service also read a `role` field from the payload without checking the key.
- **Fix:** admin only when the key matches; wrong key returns 400; `role` payload no longer read. **Verified:** correct key gives admin, wrong key 400.

### BE-05 Enrollment check inverted (Critical, P0)
- **Steps:** as a student who is not enrolled, `POST /api/enrollments/:courseId`.
- **Expected:** 201; a second attempt returns "Already enrolled". **Actual:** the first attempt returned 400 "Already enrolled in this course" (the condition was `!enrollment`).
- **Fix:** throw only when an enrollment exists. **Verified:** 201, then 400 on the duplicate.

### BE-06 Lessons can be completed on another student's enrollment (High, P1)
- **Steps:** student B calls `PATCH /api/enrollments/<student A's enrollment id>/complete-lesson`.
- **Expected:** rejected. **Actual:** 200 and A's progress changed; any ObjectId was accepted as a lesson.
- **Fix:** look the enrollment up by id and caller, and require the lesson to belong to the course. **Verified:** both cases return 400.

### BE-07 Lesson completion saved without await (Low, P3, latent)
- **Steps:** code path: `enrollment.save()` was not awaited in `completeLesson`.
- **Expected:** respond after a successful save. **Actual:** data was still written in testing, but the response did not wait and a failed save would be an unhandled rejection.
- **Fix:** `await enrollment.save()`. **Verified:** progress persists after the call.

### BE-08 Quiz percentage wrong (High, P1)
- **Steps:** submit a quiz with every answer correct.
- **Expected:** `percent` 100. **Actual:** `{"total":2,"score":2,"percent":10}`.
- **Fix:** multiply by 100; validate the payload. **Verified:** 100; a bad payload returns 400.

### BE-09 Admin assignment filter ignored (Medium, P2)
- **Steps:** `GET /api/admin/assignments?courseId=<course B>`.
- **Expected:** only course B. **Actual:** other courses' submissions returned; the query used a field `courseId` the schema does not have, and the controller dropped the query string.
- **Fix:** filter on `course` and pass `req.query`. **Verified:** only matching submissions.

### BE-10 Course search fails on regex characters (Medium, P2)
- **Steps:** `GET /api/courses?search=(`.
- **Expected:** 200 with an empty list. **Actual:** 400 "Regular expression is invalid: missing closing parenthesis".
- **Fix:** escape metacharacters before building the regex. **Verified:** 200.

### BE-11 Missing server-side validation (Medium, P2)
- **Steps:** create or update a course with price -5.
- **Expected:** 400. **Actual:** 201 on create and 200 on update. Other inputs (review status and grade, quiz and assignment payloads) already failed with generic errors.
- **Fix:** `min: 0` on price, `runValidators` on updates, explicit status, grade and payload checks. **Verified:** negative price returns 400; the other checks return explicit messages.

### BE-12 Analytics chart shows zero enrollments (Medium, P2)
- **Steps:** with enrollments created today, open Admin > Analytics (server timezone UTC+6).
- **Expected:** today's point shows them. **Actual:** the line was flat at 0 while the card said 4. Chart days came from local midnight and enrollment days from UTC, so they never matched.
- **Fix:** UTC day buckets for both. **Verified:** 3 enrollments on 2026-10-20, chart shows them.

### BE-13 Orphaned records after deleting a user or course (Medium, P2)
- **Steps:** delete a student who has enrollments; open Admin > Enrollments.
- **Expected:** no row for that student. **Actual:** a row with a blank name and email stayed; the same for submissions and for a deleted course.
- **Fix:** deleting a user or course also deletes their enrollments and submissions. **Verified:** no rows with a missing student or course.

### BE-14 Invalid course id leaks a Mongoose error (Low, P3)
- **Steps:** `GET /api/courses/not-an-id`.
- **Expected:** 404 "Course not found". **Actual:** 404 with the Mongoose `Cast to ObjectId failed...` text.
- **Fix:** validate the id first. **Verified:** clean message.

### BE-15 Backend `.env.example` holds the frontend variables (Low, P3)
- **Expected:** PORT, MONGODB_URI, JWT_SECRET and the rest. **Actual:** the file contained `VITE_API_BASE_URL`.
- **Fix:** replaced with the backend variables. **Verified:** the server starts with a `.env` copied from it.

### BE-16 Misleading CORS Allow-Methods override (Low, P3, latent)
- **Steps:** code path: a middleware set `Access-Control-Allow-Methods: GET, POST` after `cors()`.
- **Actual:** no failure observed, because `cors()` answers preflights first. It would break handling if the order changed.
- **Fix:** removed. **Verified:** preflight still lists GET, HEAD, PUT, PATCH, POST, DELETE.

## Frontend

### FE-01 Login does not persist (Critical, P0)
- **Steps:** sign in at `/login`, then open `/student`.
- **Expected:** stay signed in. **Actual:** returned to `/login`; `saveToken` wrote `user_token` and `getToken` read `token`.
- **Fix:** both use `token`. **Verified:** `token` is stored and `/student` stays open.

### FE-02 My Courses crashes to a blank screen (Critical, P0)
- **Steps:** sign in with a valid token and open `/student`.
- **Expected:** enrolled courses. **Actual:** blank page, console error `Cannot read properties of undefined (reading 'length')`; the reducer stored `action.payload.data`, which is undefined.
- **Fix:** store `action.payload`. **Verified:** courses and progress render with no console errors.

### FE-03 Dev-bypass backdoor and hardcoded JWT (Critical, P0)
- **Steps:** open `/login` (a "Dev Bypass" panel is shown); or run `localStorage.setItem('dev_bypass','true')` or add `?bypass=true`.
- **Expected:** no bypass in a shipped app. **Actual:** two signed JWTs (one admin) were in the source; the flag skipped the token check; the navbar showed portal links to anonymous visitors; a failed profile request still opened the route if any token existed.
- **Fix:** removed the panel, tokens, flag and fail-open fallback; `ProtectedRoute` validates the session with the API and redirects to `/login`. Treat the embedded tokens as exposed and rotate the signing secret if it was used outside local testing.
- **Verified:** panel gone; an anonymous visitor with the flag set lands on `/login`.

### FE-04 Course price 100 times too high (High, P1)
- **Steps:** open a course details page and compare with the card.
- **Expected:** 5,000. **Actual:** 500000 (`course.price * 100`). **Fix:** show `course.price`. **Verified:** 5,000.

### FE-05 Enrolling with a batch selected fails (High, P1)
- **Steps:** open a course with batches, select Batch 1, click Enroll Now.
- **Expected:** enrolled. **Actual:** `Enrollment validation failed: batchId: Cast to ObjectId failed for value "0"`; the page sent the array index as the batch id, and index 0 also counted as "nothing selected".
- **Fix:** select by `batch._id` and test against `null`. **Verified:** "Successfully enrolled!".

### FE-06 Player video is 300 x 700 px (Medium, P2)
- **Steps:** open `/courses/:id/player`.
- **Expected:** a 16:9 player. **Actual:** a narrow, tall iframe on every screen size.
- **Fix:** `w-full aspect-video`. **Verified:** 667 x 375 at 1280 px.

### FE-07 Completed lessons not detected (Medium, P2)
- **Steps:** open a lesson the student already completed.
- **Expected:** "Completed" and disabled. **Actual:** "Mark as Complete" stayed active; the code looked for the whole lesson object in the list of completed ids.
- **Fix:** compare string ids. **Verified:** shows "Completed".

### FE-08 Dashboard progress shows NaN% (Medium, P2)
- **Steps:** code path: percent was `completed / totalLessons`, where `totalLessons` comes from data loaded only when Details is opened.
- **Expected:** the saved percent. **Actual:** division by `undefined` gives NaN%. Confirmed from the expression, because the page could not render before FE-02 was fixed.
- **Fix:** show `enrollment.progress.percent`. **Verified:** cards show 0% and 25%.

### FE-09 Admin overview: Top Courses chart missing, fake trend (Medium, P2)
- **Steps:** sign in as admin and open `/admin`.
- **Expected:** a Top Courses chart and real numbers only. **Actual:** no chart (the page read `topCourses`/`courseTitle`/`count`, the API returns `enrollmentsByCourse`/`courseName`/`enrollments`) and a hardcoded "+12%".
- **Fix:** read the real fields, remove the fake trend. **Verified:** chart present, "+12%" gone.

### FE-10 Admin profile not loaded after reload (Low, P3)
- **Steps:** sign in as admin, reload, open `/courses`.
- **Expected:** the "Manage Courses" button. **Actual:** missing; the profile was requested only when not "authenticated", but that flag starts true when a token exists.
- **Fix:** request the profile whenever there is a token and no user. **Verified:** button appears.

### FE-11 Navbar problems (Medium, P3)
- **Steps:** open the home page; then open the mobile menu at 390 px while signed in.
- **Expected:** only the current page highlighted, full menu, working links. **Actual:** Home and Courses always highlighted (`pathname.startsWith('/')` is always true); the menu was cut off at 128 px; the Profile link led to a 404.
- **Fix:** use `isActive` (with `end` for Home), let the menu scroll to 80% of the screen, remove the dead link. **Verified:** one active link; the mobile menu is 313 px tall.

### FE-12 Search from page 2 sends a stale request (Low, P3)
- **Steps:** with more than 8 courses, go to page 2, search, click Search.
- **Expected:** one request for page 1. **Actual:** two requests, `page=2&search=...` then `page=1&search=...`.
- **Fix:** fetch with an explicit page. **Verified:** one request.

### FE-13 Course card markup (Low, P3)
- **Steps:** open `/courses` and watch the console.
- **Expected:** valid HTML and wrapped titles. **Actual:** React warning "`<div>` cannot be a descendant of `<p>`"; titles forced onto one line.
- **Fix:** `div` wrapper and a two-line title clamp. **Verified:** no warning.

### FE-14 Dead About link (Low, P3)
- **Steps:** click "About Us" in the footer.
- **Expected:** an About page. **Actual:** `/about` is not a route, so the 404 page shows.
- **Fix:** link removed. **Verified:** footer shows Home and Courses only.

### FE-15 Nested main landmarks (Low, P3)
- **Steps:** open an `/admin` page and count `<main>` elements.
- **Expected:** one. **Actual:** two, nested.
- **Fix:** the inner element is a `div`. **Verified:** one.

## Regression checks

API suite: 35 of 35 pass. Frontend builds with `vite build`. Chrome runs passed for: register, sign in and wrong password; search, details, enrol with a batch; player, quiz and 100% progress; student blocked from `/admin`; admin create, edit and delete a course; all admin pages load. `npm run lint` went from 18 to 13 errors; the rest are existing warnings in untouched code.
