# TeamBoard

A simplified project management platform where users can create projects, organize tasks, and track progress.

**MERN Stack Assessment** | Difficulty: Moderate

---

## Overview

TeamBoard is a full-stack collaborative task management application: JWT authentication with persistent sessions, project and task CRUD with ownership scoping, a live dashboard, server-side search/filter/sort, pagination, and a responsive UI.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19 (Vite), React Router, Tailwind CSS v4 |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (access + refresh tokens, httpOnly refresh cookie) |
| **Validation** | Zod |

---

## Features

### Authentication
- Register, login, and logout
- Access token (15m) held client-side, refresh token (30d) in an httpOnly cookie — "Remember me" controls whether the refresh cookie persists across browser restarts
- Session restored automatically on page refresh via `GET /api/auth/me` / `GET /api/auth/refresh`
- All project/task/user/dashboard routes require a valid access token

### Dashboard
- Total projects, total tasks, completed tasks, pending tasks
- Recent activity feed, derived from the most recently updated projects and tasks

### Project Management
- Create, update, delete, and archive projects
- Each project has: name, description, status (Active / Completed / Archived), created date
- Per-owner stats (total / active / completed) and pagination

### Task Management
- Each task belongs to a project and has: title, description, priority (Low/Medium/High), status (Todo/In Progress/Completed), due date
- Create, edit, delete, mark complete
- Search by title, filter by status, filter by priority, sort by due date — all applied server-side

### User Profile
- View profile, update name, update profile photo (file upload), change password

### UI
- Responsive navbar with a collapsible sidebar (off-canvas on mobile/tablet, fixed on desktop)
- Dashboard, project listing, task listing, forms with validation feedback
- Empty states, loading states, error states
- Confirmation dialogs before deleting a project or task
- Toast notifications for create/update/delete actions

---

## Error Handling & Validation

- All request bodies/queries validated with Zod (required fields, email format, password length ≥ 8, enum values); failures return `400` with field-level messages
- Duplicate email on signup returns `409`
- Invalid MongoDB ObjectIds (bad `:projectId`/`:taskId`) return `400`, not a crash
- Unauthenticated requests return `401`; requests for another user's project/task return `404` (ownership is never leaked via `403`)
- Unmatched routes return a JSON `404`; uncaught errors are funneled through a single Express error-handling middleware and return `500` with a generic message (never a stack trace or crash)

---

## Database Design

| Collection | Purpose | Key relationships |
|------------|---------|--------------------|
| **User** | Auth + profile (email, hashed password, username, profile photo, hashed refresh token) | — |
| **Project** | name, description, status, timestamps | `owner` → User |
| **Task** | title, description, priority, status, due date, timestamps | `project` → Project, `assignedTo` → User |

---

## Folder Structure

```
TeamBoard/
├── Backend/
│   ├── uploads/profile-pics/    # uploaded profile photos (served statically)
│   └── src/
│       ├── app.ts               # Express app + middleware/route wiring
│       ├── server.ts            # entry point
│       ├── config/env.ts        # environment variables
│       ├── lib/db.ts            # Mongo connection
│       ├── controllers/         # request handlers (auth, project, task, user, dashboard)
│       ├── routes/              # route definitions per resource
│       ├── middleware/          # auth, error handler, cors, cookie parsing, uploads
│       ├── models/               # Mongoose schemas (User, Project, Task)
│       ├── schemas/              # Zod validation schemas
│       └── utils/                # jwt, asyncHandler
│
└── Frontend/
    └── src/
        ├── api/                 # thin fetch wrappers per resource (client.js is the shared HTTP layer)
        ├── components/          # reusable UI (Layout, Form, ConfirmDialog, Pagination, ...)
        ├── contexts/            # AuthContext, ToastContext
        ├── hooks/                # useAuth, useToast
        └── pages/                # route-level views (Dashboard, Projects, Tasks, Profile, Auth)
```

---

## Environment Variables

Create `Backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/teamboard
JWT_ACCESS_SECRET=replace_with_a_long_random_string
JWT_REFRESH_SECRET=replace_with_a_different_long_random_string
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Frontend reads `VITE_API_URL` (defaults to `http://localhost:3000` if unset) — set it in `Frontend/.env` when the backend isn't on the default port/host.

> Never commit a real `.env` file. Rotate the JWT secrets above if this repo's `Backend/.env` was ever committed.

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a connection string to a remote instance)

### Backend
```bash
cd Backend
npm install
# create .env as shown above
npm run dev
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

### Run Locally
1. Start MongoDB
2. `cd Backend && npm run dev` (defaults to `http://localhost:3000`)
3. `cd Frontend && npm run dev` (defaults to `http://localhost:5173`)
4. Open `http://localhost:5173`

---

## API Overview

All routes below except `/api/auth/signup`, `/api/auth/login`, and `/api/auth/refresh` require `Authorization: Bearer <accessToken>`.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/login` | Login (sets refresh cookie, returns access token) |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/refresh` | Rotate tokens from the refresh cookie |
| GET | `/api/auth/me` | Current user |
| GET | `/api/dashboard` | Totals + recent activity |
| GET | `/api/projects` | List projects (paginated, with stats) |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:projectId` | Update project |
| DELETE | `/api/projects/:projectId` | Delete project (and its tasks) |
| PATCH | `/api/projects/:projectId/archive` | Archive project |
| GET | `/api/projects/:projectId/tasks` | List a project's tasks |
| POST | `/api/projects/:projectId/tasks` | Create task |
| PUT | `/api/projects/:projectId/tasks/:taskId` | Update task |
| DELETE | `/api/projects/:projectId/tasks/:taskId` | Delete task |
| PATCH | `/api/projects/:projectId/tasks/:taskId/complete` | Mark task complete |
| GET | `/api/tasks` | List all of the user's tasks (paginated; `search`, `status`, `priority`, `sortBy` query params) |
| PATCH | `/api/users/profile` | Update username/profile photo |
| PATCH | `/api/users/password` | Change password |

---

## Bonus Features Implemented

- Pagination (projects and tasks)
- Toast notifications
- Server-side search/filter/sort for tasks

## Bonus Features Not Implemented

Dark mode, drag & drop, activity-log collection, infinite scroll, unit tests.

---

## Submission Checklist

- [x] GitHub repository
- [x] README.md
- [ ] Live deployment link (frontend)
- [ ] Live deployment link (backend/API)
- [ ] Screenshots

---

## Evaluation Criteria

| Category | Marks |
|----------|-------|
| UI & Responsiveness | 20 |
| React Architecture | 15 |
| Backend APIs | 20 |
| MongoDB Design | 10 |
| Authentication | 10 |
| Code Quality | 10 |
| Validation & Error Handling | 10 |
| Documentation | 5 |
| **Total** | **100** |

---

## License

This project is built as a MERN stack assessment submission.
