# CourseMaster QA Bug Report

33 bugs found in the CourseMaster backend (`BE-`) and frontend (`FE-`); all are fixed and verified locally. Each bug follows the 5-point template: title, location and steps, expected vs actual, severity and evidence, fix and verification status. The version with screenshots is the Google Docs report.

**Method.** The project was set up locally, the original code (git HEAD of the Pullock4981 repos) was run next to the fixed code, and the live site (https://course-master-front-end.vercel.app/) was explored read-only: it is the original build and shows FE-03, FE-04, FE-11 and BE-01. Backend bugs were reproduced with a 35-check API script (original: 17 failed; fixed: all pass); frontend bugs in Chrome against the same backend. Entries marked latent or code path (BE-07, BE-16, FE-08) could not be shown as a direct failure.

**Severity:** Critical = major feature unusable, crash or severe security issue; High = important feature fails or is significantly wrong; Medium = works incorrectly but a workaround exists; Low = minor UI or low-impact inconsistency. **Priority:** P1 fix immediately, P2 as soon as possible, P3 when higher-priority issues are resolved, P4 low urgency.

## Summary

| ID | Bug | Severity | Priority | Status |
| --- | --- | --- | --- | --- |
| BE-01 | Valid password rejected on login | Critical | P1 | Fixed & Verified |
| BE-02 | Invalid or expired JWT lets the request through | Critical | P1 | Fixed & Verified |
| BE-03 | Banned or deleted users keep access with their old token | High | P2 | Fixed & Verified |
| BE-04 | Admin registration key never grants the admin role | Medium | P3 | Fixed & Verified |
| BE-05 | First enrollment always fails with "Already enrolled" | Critical | P1 | Fixed & Verified |
| BE-06 | Lessons can be completed on another student's enrollment | High | P2 | Fixed & Verified |
| BE-07 | Lesson completion saved without await (latent) | Low | P4 | Fixed & Verified |
| BE-08 | Quiz percentage multiplied by 10 instead of 100 | High | P2 | Fixed & Verified |
| BE-09 | Admin assignment list ignores the course filter | Medium | P3 | Fixed & Verified |
| BE-10 | Course search returns HTTP 400 for regex characters | Medium | P3 | Fixed & Verified |
| BE-11 | Missing server-side validation for course price | Medium | P3 | Fixed & Verified |
| BE-12 | Analytics chart shows zero enrollments (timezone mismatch) | Medium | P3 | Fixed & Verified |
| BE-13 | Deleting a user or course leaves orphaned records | Medium | P3 | Fixed & Verified |
| BE-14 | Invalid course id returns a raw Mongoose error | Low | P4 | Fixed & Verified |
| BE-15 | Backend .env.example contains the frontend variables | Low | P4 | Fixed & Verified |
| BE-16 | Misleading CORS Allow-Methods override (latent) | Low | P4 | Fixed & Verified |
| BE-17 | Validation errors return no detail | Medium | P3 | Fixed & Verified |
| FE-01 | Login does not persist (token key mismatch) | Critical | P1 | Fixed & Verified |
| FE-02 | My Courses page crashes to a blank screen | Critical | P1 | Fixed & Verified |
| FE-03 | Dev-bypass backdoor and hardcoded admin JWT | Critical | P1 | Fixed & Verified |
| FE-04 | Course price shown 100 times too high | High | P2 | Fixed & Verified |
| FE-05 | Enrolling with a batch selected fails | High | P2 | Fixed & Verified |
| FE-06 | Course player video is 300 x 700 px | Medium | P3 | Fixed & Verified |
| FE-07 | Completed lessons not detected in the player | Medium | P3 | Fixed & Verified |
| FE-08 | Dashboard progress shows NaN% (code path) | Medium | P3 | Fixed & Verified |
| FE-09 | Admin overview: Top Courses chart missing, fake trend | Medium | P3 | Fixed & Verified |
| FE-10 | Admin profile not loaded after a page reload | Low | P4 | Fixed & Verified |
| FE-11 | Navbar: every link active, mobile menu clipped, dead link | Medium | P4 | Fixed & Verified |
| FE-12 | Searching from page 2 sends a stale-page request | Low | P4 | Fixed & Verified |
| FE-13 | Course card: invalid HTML and unwrapped titles | Low | P4 | Fixed & Verified |
| FE-14 | Footer links to a non-existent About page | Low | P4 | Fixed & Verified |
| FE-15 | Nested main landmarks in the admin layout | Low | P4 | Fixed & Verified |
| FE-16 | Register and Login give no validation feedback; failures are silent | Medium | P3 | Fixed & Verified |

## Backend bug reports

### BE-01: Valid password rejected on login

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-01: Valid password rejected on login |
| Location & Steps to Reproduce | Backend, `POST /api/auth/login`. Send admin@coursemaster.com / admin123 (the documented admin account). |
| Expected vs. Actual Result | Expected: 200 and a JWT. Actual: 400 "Invalid email or password" for every user, because the password was compared with the stored bcrypt hash using `===`. The live site shows the same error for the demo admin. |
| Severity & Evidence | Critical (P1). API check T01: status 400 on the original, 200 on the fixed code. Live site: login returns 400. |
| Fix & Verification Status | Used `bcrypt.compare`, normalised the email, rejected banned users. Verified: right password 200, wrong password 400. Status: Fixed & Verified. |

### BE-02: Invalid or expired JWT lets the request through

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-02: Invalid or expired JWT lets the request through |
| Location & Steps to Reproduce | Backend, auth middleware. `GET /api/auth/me` with header `Authorization: Bearer garbage`. |
| Expected vs. Actual Result | Expected: 401. Actual: the middleware called `next()` after a failed verification, so the request ran with no user and returned 404 `Cannot read properties of undefined (reading 'id')`. |
| Severity & Evidence | Critical (P1). T03: 404 with that message on the original, 401 on the fixed code. |
| Fix & Verification Status | Return 401 "Invalid or expired token". Verified on `/auth/me` and `/users`. Status: Fixed & Verified. |

### BE-03: Banned or deleted users keep access with their old token

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-03: Banned or deleted users keep access with their old token |
| Location & Steps to Reproduce | Backend, auth middleware. Log in as a student and keep the token; as admin ban (or delete) that user; call `GET /api/auth/me` with the old token. |
| Expected vs. Actual Result | Expected: 403 (banned) or 401 (deleted). Actual: 200 for the banned user and a 404 error for the deleted one; the 30-day token stayed valid and banned users could log in. |
| Severity & Evidence | High (P2). T22 / T22b / T23 failed on the original (status 200 for the banned user's token). |
| Fix & Verification Status | The middleware reloads the user on each request, rejects missing or banned accounts and takes the role from the DB; login refuses banned users. Verified. Status: Fixed & Verified. |

### BE-04: Admin registration key never grants the admin role

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-04: Admin registration key never grants the admin role |
| Location & Steps to Reproduce | Backend, `POST /api/auth/register` with `adminKey` equal to ADMIN_REGISTRATION_KEY (documented in the README). |
| Expected vs. Actual Result | Expected: role admin; a wrong key is rejected. Actual: role always student, a wrong key was silently accepted, and the service read a `role` field from the payload without checking the key. |
| Severity & Evidence | Medium (P3). Original: correct key returned role `student`; fixed code returns `admin`, wrong key returns 400 (T04). |
| Fix & Verification Status | Admin only when the key matches the environment value; wrong key returns 400; the `role` payload field is ignored. Verified. Status: Fixed & Verified. |

### BE-05: First enrollment always fails with "Already enrolled"

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-05: First enrollment always fails with "Already enrolled" |
| Location & Steps to Reproduce | Backend, `POST /api/enrollments/:courseId` as a student who is not enrolled. |
| Expected vs. Actual Result | Expected: 201 and an enrollment; a second attempt returns "Already enrolled". Actual: the first attempt returned 400 "Already enrolled in this course" (the check was `!enrollment`), so nobody could enrol. |
| Severity & Evidence | Critical (P1). T09 failed on the original with that message; passes on the fixed code. |
| Fix & Verification Status | Throw only when an enrollment already exists. Verified: 201, then 400 on a duplicate (T09, T10). Status: Fixed & Verified. |

### BE-06: Lessons can be completed on another student's enrollment

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-06: Lessons can be completed on another student's enrollment |
| Location & Steps to Reproduce | Backend, `PATCH /api/enrollments/:enrollId/complete-lesson`. Student B sends student A's enrollment id with any lessonId. |
| Expected vs. Actual Result | Expected: rejected. Actual: 200 and A's progress changed; any ObjectId was also accepted as a lesson. |
| Severity & Evidence | High (P2). T13: status 200 on the original, 400 on the fixed code. |
| Fix & Verification Status | The enrollment is looked up by id and the caller, and the lesson must belong to the course. Verified (T12c, T13). Status: Fixed & Verified. |

### BE-07: Lesson completion saved without await (latent)

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-07: Lesson completion saved without await (latent) |
| Location & Steps to Reproduce | Backend, `completeLesson` in `enrollment.service.js` (code path). |
| Expected vs. Actual Result | Expected: respond after a successful save and report save errors. Actual: `enrollment.save()` was not awaited; data was still written in testing, but the response did not wait and a failed save would be an unhandled rejection. |
| Severity & Evidence | Low (P4). Code inspection; no data loss observed (substantiated, not a visible failure). |
| Fix & Verification Status | `await enrollment.save()`. Verified: progress persists (T12b). Status: Fixed & Verified. |

### BE-08: Quiz percentage multiplied by 10 instead of 100

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-08: Quiz percentage multiplied by 10 instead of 100 |
| Location & Steps to Reproduce | Backend, `POST /api/quizzes/submit` with every answer correct. |
| Expected vs. Actual Result | Expected: `percent` 100. Actual: `{"total":2,"score":2,"percent":10}`, so averages and grade colours were wrong. |
| Severity & Evidence | High (P2). Response above, from the original code. |
| Fix & Verification Status | Multiply by 100 and validate the payload. Verified: 100, and a bad payload returns 400 (T14, T14b). Status: Fixed & Verified. |

### BE-09: Admin assignment list ignores the course filter

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-09: Admin assignment list ignores the course filter |
| Location & Steps to Reproduce | Backend, `GET /api/admin/assignments?courseId=<id>`. |
| Expected vs. Actual Result | Expected: only that course's submissions. Actual: other courses' submissions were returned; the query used a field `courseId` that the schema does not have, and the controller dropped the query string. |
| Severity & Evidence | Medium (P3). T16b: 1 item from another course on the original, 0 on the fixed code. |
| Fix & Verification Status | Filter on `course` and pass `req.query`. Verified (T16, T16b). Status: Fixed & Verified. |

### BE-10: Course search returns HTTP 400 for regex characters

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-10: Course search returns HTTP 400 for regex characters |
| Location & Steps to Reproduce | Backend, `GET /api/courses?search=(`. |
| Expected vs. Actual Result | Expected: 200 with an empty list. Actual: 400 "Regular expression is invalid: missing closing parenthesis"; user input was used as a raw regex. |
| Severity & Evidence | Medium (P3). T08 error text above. |
| Fix & Verification Status | Escape regex metacharacters. Verified: 200. Status: Fixed & Verified. |

### BE-11: Missing server-side validation for course price

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-11: Missing server-side validation for course price |
| Location & Steps to Reproduce | Backend, `POST` or `PATCH /api/admin/courses` with `price: -5`. |
| Expected vs. Actual Result | Expected: 400. Actual: 201 on create and 200 on update; a negative price was stored. |
| Severity & Evidence | Medium (P3). T19 / T19b: statuses 201 and 200 on the original. |
| Fix & Verification Status | `min: 0` on price and `runValidators` on updates; review status and grade (0-100) and assignment/quiz payloads now get explicit checks. Verified (T14b, T15, T17, T17b, T19). Status: Fixed & Verified. |

### BE-12: Analytics chart shows zero enrollments (timezone mismatch)

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-12: Analytics chart shows zero enrollments (timezone mismatch) |
| Location & Steps to Reproduce | Admin > Analytics with enrollments created today (server timezone UTC+6). |
| Expected vs. Actual Result | Expected: today's point shows the enrollments. Actual: the line is flat at 0 while the card says 4, because chart days used local midnight and enrollment days used UTC; the last label was also a day off. |
| Severity & Evidence | Medium (P3). Screenshot below; the API returned `enrollments: 0` for every day. |
| Fix & Verification Status | UTC day buckets for both. Verified: 3 enrollments on 2026-10-20 and the chart shows them. Status: Fixed & Verified. |

### BE-13: Deleting a user or course leaves orphaned records

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-13: Deleting a user or course leaves orphaned records |
| Location & Steps to Reproduce | Delete a student who has enrollments, then open Admin > Enrollments. |
| Expected vs. Actual Result | Expected: no row for that student. Actual: a row with a blank name and email remains, and totals still count it; the same happens for submissions and for a deleted course. |
| Severity & Evidence | Medium (P3). Screenshot below (blank first row). |
| Fix & Verification Status | Deleting a user or course also deletes their enrollments and submissions. Verified: no rows with a missing student or course. Status: Fixed & Verified. |

### BE-14: Invalid course id returns a raw Mongoose error

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-14: Invalid course id returns a raw Mongoose error |
| Location & Steps to Reproduce | Backend, `GET /api/courses/not-an-id`. |
| Expected vs. Actual Result | Expected: 404 "Course not found". Actual: 404 with `Cast to ObjectId failed for value "not-an-id" (type string) at path "_id" for model "Course"`. |
| Severity & Evidence | Low (P4). T08b message above. |
| Fix & Verification Status | Validate the id first. Verified: "Course not found". Status: Fixed & Verified. |

### BE-15: Backend .env.example contains the frontend variables

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-15: Backend .env.example contains the frontend variables |
| Location & Steps to Reproduce | Open `courseMaster_Backend/.env.example` and follow the README setup. |
| Expected vs. Actual Result | Expected: PORT, MONGODB_URI, JWT_SECRET and the other backend variables. Actual: the file held `VITE_API_BASE_URL`, so a new developer had no template. |
| Severity & Evidence | Low (P4). File contents on the original. |
| Fix & Verification Status | Replaced with the backend variables. Verified: the server starts with a `.env` copied from it. Status: Fixed & Verified. |

### BE-16: Misleading CORS Allow-Methods override (latent)

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-16: Misleading CORS Allow-Methods override (latent) |
| Location & Steps to Reproduce | Backend, `app.js` (code path): a middleware set `Access-Control-Allow-Methods: GET, POST` after `cors()`. |
| Expected vs. Actual Result | Expected: PUT, PATCH and DELETE work from the browser. Actual: no failure observed, because `cors()` answers preflights first; the override would break handling if the order changed. |
| Severity & Evidence | Low (P4). T20 passed on the original, so this is substantiated by code only. |
| Fix & Verification Status | Removed. Verified: preflight still lists GET, HEAD, PUT, PATCH, POST, DELETE (T20). Status: Fixed & Verified. |

### BE-17: Validation errors return no detail

| Field | Detail |
| --- | --- |
| Bug ID & Title | BE-17: Validation errors return no detail |
| Location & Steps to Reproduce | Backend, `POST /api/auth/register` with `{"name":"A","email":"bad","password":"1"}`. |
| Expected vs. Actual Result | Expected: a 400 that says which fields are wrong. Actual: `{"message":"Validation error"}` only; the middleware read `err.errors`, which does not exist in Zod 4 (`issues`), so `errors` was undefined and the app could only show "Validation error". |
| Severity & Evidence | Medium (P3). Zod 4.1.13: `err.errors` is `undefined`, `err.issues` has 3 entries. |
| Fix & Verification Status | Use `err.issues`, return `{ message: "Validation error: name: ...; email: ...", errors: [{field, message}] }`, and add clear schema messages. Verified: the middleware returns all three field errors; valid input passes. Status: Fixed & Verified. |

## Frontend bug reports

### FE-01: Login does not persist (token key mismatch)

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-01: Login does not persist (token key mismatch) |
| Location & Steps to Reproduce | Login page, sign in as student@coursemaster.com / student123, then open /student. |
| Expected vs. Actual Result | Expected: stay signed in. Actual: sent back to /login; the token was saved as `user_token` but read as `token`, so localStorage held `["user_token","theme"]`. |
| Severity & Evidence | Critical (P1). localStorage keys after login on the original: `user_token`, `theme`. |
| Fix & Verification Status | Both functions use the key `token`. Verified: `token` is stored and /student stays open. Status: Fixed & Verified. |

### FE-02: My Courses page crashes to a blank screen

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-02: My Courses page crashes to a blank screen |
| Location & Steps to Reproduce | Sign in with a valid token and open /student. |
| Expected vs. Actual Result | Expected: the list of enrolled courses. Actual: blank page; console error `Cannot read properties of undefined (reading 'length')` because the reducer stored `action.payload.data`, which is undefined. |
| Severity & Evidence | Critical (P1). Screenshots below. |
| Fix & Verification Status | Store `action.payload`. Verified: courses and progress render with no console errors. Status: Fixed & Verified. |

### FE-03: Dev-bypass backdoor and hardcoded admin JWT

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-03: Dev-bypass backdoor and hardcoded admin JWT |
| Location & Steps to Reproduce | Open /login (a "Dev Bypass" panel offers Student and Admin Portal buttons), or run `localStorage.setItem('dev_bypass','true')` or add `?bypass=true`. |
| Expected vs. Actual Result | Expected: no bypass in a shipped app. Actual: two signed JWTs (one admin) were in the source; the flag skipped the token check; the navbar showed portal links to anonymous visitors; and a failed profile request still opened the route if any token existed. The panel is visible on the live site. |
| Severity & Evidence | Critical (P1). Screenshot below; the panel is also present on https://course-master-front-end.vercel.app/login. |
| Fix & Verification Status | Removed the panel, tokens, flag and fail-open fallback; `ProtectedRoute` validates the session with the API and redirects to /login. Treat the embedded tokens as exposed and rotate the signing secret if it was used outside local testing. Verified: an anonymous visitor with the flag set lands on /login. Status: Fixed & Verified. |

### FE-04: Course price shown 100 times too high

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-04: Course price shown 100 times too high |
| Location & Steps to Reproduce | Open any course details page and compare with the course card. |
| Expected vs. Actual Result | Expected: ৳ 5,000. Actual: ৳ 500000 (`course.price * 100`). Also visible on the live site. |
| Severity & Evidence | High (P2). Screenshots below. |
| Fix & Verification Status | Show `course.price` with thousands separators. Verified: ৳ 5,000. Status: Fixed & Verified. |

### FE-05: Enrolling with a batch selected fails

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-05: Enrolling with a batch selected fails |
| Location & Steps to Reproduce | Course details of a course with batches, select "Batch 1", click Enroll Now. |
| Expected vs. Actual Result | Expected: enrolled. Actual: error `Enrollment validation failed: batchId: Cast to ObjectId failed for value "0"`; the page sent the array index as the batch id, and index 0 also counted as "nothing selected". |
| Severity & Evidence | High (P2). Screenshots below. |
| Fix & Verification Status | Select by `batch._id` and test against `null`. Verified: "Successfully enrolled!". Status: Fixed & Verified. |

### FE-06: Course player video is 300 x 700 px

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-06: Course player video is 300 x 700 px |
| Location & Steps to Reproduce | Open /courses/:id/player for an enrolled course. |
| Expected vs. Actual Result | Expected: a 16:9 player that fills the card. Actual: a narrow, tall strip on every screen size. |
| Severity & Evidence | Medium (P3). Screenshots below; measured 300 x 700. |
| Fix & Verification Status | `w-full aspect-video`. Verified: 667 x 375 at 1280 px. Status: Fixed & Verified. |

### FE-07: Completed lessons not detected in the player

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-07: Completed lessons not detected in the player |
| Location & Steps to Reproduce | Open the player on a lesson the student already completed. |
| Expected vs. Actual Result | Expected: the button reads "Completed" and is disabled. Actual: "Mark as Complete" stayed active; the code looked for the whole lesson object in the list of completed ids. |
| Severity & Evidence | Medium (P3). Button text on the original: "Mark as Complete". |
| Fix & Verification Status | Compare string ids. Verified: "Completed". Status: Fixed & Verified. |

### FE-08: Dashboard progress shows NaN% (code path)

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-08: Dashboard progress shows NaN% (code path) |
| Location & Steps to Reproduce | Student dashboard, first view of My Courses (code path). |
| Expected vs. Actual Result | Expected: the saved progress percent. Actual: `completed / totalLessons` with `totalLessons` undefined until Details is opened gives NaN%. Confirmed from the expression, because the page could not render before FE-02 was fixed. |
| Severity & Evidence | Medium (P3). Code inspection. |
| Fix & Verification Status | Show `enrollment.progress.percent`. Verified: cards show 0% and 25%. Status: Fixed & Verified. |

### FE-09: Admin overview: Top Courses chart missing, fake trend

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-09: Admin overview: Top Courses chart missing, fake trend |
| Location & Steps to Reproduce | Sign in as admin and open /admin. |
| Expected vs. Actual Result | Expected: a Top Courses chart and real numbers. Actual: no chart (the page read `topCourses` / `courseTitle` / `count`; the API returns `enrollmentsByCourse` / `courseName` / `enrollments`) and a hardcoded "+12%". |
| Severity & Evidence | Medium (P3). Screenshots below. |
| Fix & Verification Status | Read the real fields and removed the fake trend. Verified: chart present, "+12%" gone. Status: Fixed & Verified. |

### FE-10: Admin profile not loaded after a page reload

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-10: Admin profile not loaded after a page reload |
| Location & Steps to Reproduce | Sign in as admin, reload, open /courses. |
| Expected vs. Actual Result | Expected: the "Manage Courses" button. Actual: missing; the profile was requested only when not "authenticated", but that flag starts true when a token exists. |
| Severity & Evidence | Low (P4). Button count 0 on the original. |
| Fix & Verification Status | Request the profile whenever there is a token and no user. Verified: button count 1. Status: Fixed & Verified. |

### FE-11: Navbar: every link active, mobile menu clipped, dead link

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-11: Navbar: every link active, mobile menu clipped, dead link |
| Location & Steps to Reproduce | Open the home page; then open the hamburger menu at 390 px width while signed in. |
| Expected vs. Actual Result | Expected: only the current page highlighted, the whole menu visible, working links. Actual: Home and Courses always highlighted (`pathname.startsWith('/')`), the menu cut off at 128 px so Dashboard and Logout are hidden, and Profile led to a 404. Also seen on the live site (127 px menu). |
| Severity & Evidence | Medium (P4). Screenshots below. |
| Fix & Verification Status | Use `isActive` (with `end` for Home), let the menu scroll up to 80% of the screen, remove the dead link. Verified: one active link, menu 313 px tall. Status: Fixed & Verified. |

### FE-12: Searching from page 2 sends a stale-page request

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-12: Searching from page 2 sends a stale-page request |
| Location & Steps to Reproduce | With more than 8 courses go to page 2, type a search, click Search. |
| Expected vs. Actual Result | Expected: one request for page 1. Actual: two requests, `page=2&search=...` then `page=1&search=...`. |
| Severity & Evidence | Low (P4). Network log above. |
| Fix & Verification Status | Fetch with an explicit page. Verified: one request. Status: Fixed & Verified. |

### FE-13: Course card: invalid HTML and unwrapped titles

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-13: Course card: invalid HTML and unwrapped titles |
| Location & Steps to Reproduce | Open /courses and watch the console. |
| Expected vs. Actual Result | Expected: valid HTML, wrapped titles. Actual: React warning "In HTML, <div> cannot be a descendant of <p>"; titles forced onto one line. |
| Severity & Evidence | Low (P4). Console warning above. |
| Fix & Verification Status | `div` wrapper and a two-line title clamp. Verified: no warning. Status: Fixed & Verified. |

### FE-14: Footer links to a non-existent About page

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-14: Footer links to a non-existent About page |
| Location & Steps to Reproduce | Click "About Us" in the footer. |
| Expected vs. Actual Result | Expected: an About page. Actual: `/about` is not a route, so the 404 page shows. |
| Severity & Evidence | Low (P4). Route table in `App.jsx`. |
| Fix & Verification Status | Link removed. Verified: footer shows Home and Courses only. Status: Fixed & Verified. |

### FE-15: Nested main landmarks in the admin layout

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-15: Nested main landmarks in the admin layout |
| Location & Steps to Reproduce | Open any /admin page and count `<main>` elements. |
| Expected vs. Actual Result | Expected: one. Actual: two, nested, which confuses screen readers. |
| Severity & Evidence | Low (P4). Count was 2 in the browser. |
| Fix & Verification Status | The inner element is a `div`. Verified: one. Status: Fixed & Verified. |

### FE-16: Register and Login give no validation feedback; failures are silent

| Field | Detail |
| --- | --- |
| Bug ID & Title | FE-16: Register and Login give no validation feedback; failures are silent |
| Location & Steps to Reproduce | Register with a 1-character password, or open the player and make a lesson-completion request fail, or open Admin > Enrollments with the API unreachable. |
| Expected vs. Actual Result | Expected: field-level messages, a loading state and an error message. Actual: no client-side checks (the user only saw "Validation error"), the Mark as Complete button had no loading state and failures were only logged to the console, and the admin Enrollments and Assignments pages showed "No ... found" when the request failed. |
| Severity & Evidence | Medium (P3). Code inspection plus BE-17. |
| Fix & Verification Status | Register validates name, email and password and maps backend field errors onto the inputs; Login and Register show a clear message when the server is unreachable; Mark as Complete shows a saving state and an error alert; admin lists show an error with a Retry button. Verified in the browser (see regression section). Status: Fixed & Verified. |
