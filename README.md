# TeamBoard

A simplified project management platform where users can create workspaces, manage projects, organize tasks, and collaborate with their team.

**MERN Stack Assessment** | Expected Duration: 20–30 Hours | Difficulty: Moderate

---

## Overview

TeamBoard is a full-stack collaborative task management application built to demonstrate production-ready MERN development: clean architecture, scalable APIs, maintainable React code, and thoughtful handling of edge cases.

The goal is not to build the most feature-rich solution, but to show how you structure a project, design a database, build scalable APIs, write maintainable frontend code, and think like a software engineer beyond basic CRUD.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js (or Next.js), Router, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT |

> **Guidelines:** Build from scratch using only the MERN stack. Do not use Firebase or Supabase. Use local MongoDB.

---

## Features

### Authentication
- Register, login, and logout
- Stay logged in after page refresh (persistent session)
- Protected routes — unauthenticated users cannot access app pages

### Dashboard
After login, display:
- Total Projects
- Total Tasks
- Completed Tasks
- Pending Tasks
- Recent Activity

### Project Management
- Create, update, delete, and archive projects
- Each project includes: **Name**, **Description**, **Status**, **Created Date**

### Task Management
Each project can have multiple tasks with:
- **Title**, **Description**
- **Priority** — Low, Medium, High
- **Status** — Todo, In Progress, Completed
- **Due Date**

Operations: create, edit, delete, mark complete

### Search & Filter
- Search by task title
- Filter by status
- Filter by priority
- Sort by due date

### User Profile
- View profile
- Update name
- Update profile photo *(optional)*
- Change password *(optional)*

### UI Requirements
- Responsive navbar and sidebar navigation
- Dashboard, project listing, task listing
- Forms with validation feedback
- Empty states, loading states, error states
- Confirmation dialogs (e.g. delete/archive)
- Responsive on desktop, tablet, and mobile

---

## Edge Cases & Error Handling

The application must handle invalid input gracefully and **never crash** due to bad data.

### Authentication & Authorization
- Unauthorized requests (missing/expired/invalid JWT)
- Access only authenticated routes on the frontend and backend

### Validation
- Required fields
- Email format validation
- Password length requirements
- Duplicate email on registration
- Invalid MongoDB ObjectIds
- Invalid request payloads

### API & Server Errors
- Resource not found (404)
- Invalid routes (404)
- Validation errors (400)
- Server errors (500) with meaningful JSON responses
- Meaningful HTTP status codes on all endpoints

### UX Edge Cases
- Empty lists (no projects, no tasks)
- Loading states while fetching data
- Error states when API calls fail
- Confirmation before destructive actions (delete project/task)

---

## Database Design

Minimum collections with proper relationships:

| Collection | Purpose |
|------------|---------|
| **User** | Authentication, profile (name, email, optional photo) |
| **Project** | Belongs to a user; name, description, status, created date, archived flag |
| **Task** | Belongs to a project; title, description, priority, status, due date |

Relationships should be modeled so projects are scoped to their owner and tasks are scoped to their project.

---

## Planned Folder Structure

```
TeamBoard/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route-level views
│       ├── context/        # Auth & global state
│       ├── hooks/          # Custom hooks
│       ├── services/       # API calls (Axios)
│       ├── utils/          # Helpers
│       └── App.jsx
│
├── server/                 # Express backend
│   ├── config/             # DB connection, env
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth, validation, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── utils/              # Shared utilities
│   └── server.js
│
├── .env.example
└── README.md
```

---

## Environment Variables

Create a `.env` file in the `server/` directory (and `client/` if needed):

```env
# Server
PORT=5000
MONGODB_URI=mongodb://localhost:27017/teamboard
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
NODE_ENV=development

# Client (if using Vite/CRA)
VITE_API_URL=http://localhost:5000/api
```

> Copy `.env.example` to `.env` and fill in real values before running. Never commit `.env` to version control.

---

## Installation & Setup

> *Steps below will be updated once the codebase is scaffolded.*

### Prerequisites
- Node.js (v18+)
- MongoDB running locally
- npm or yarn

### Backend
```bash
cd server
npm install
cp .env.example .env   # configure variables
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Run Locally
1. Start MongoDB
2. Start the backend server (`server/`)
3. Start the frontend dev server (`client/`)
4. Open the frontend URL in your browser (typically `http://localhost:5173` or `http://localhost:3000`)

---

## API Overview

REST API with controllers, routes, middleware, and models. All protected routes require a valid JWT.

| Area | Endpoints (planned) |
|------|---------------------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` |
| Projects | CRUD + archive |
| Tasks | CRUD + mark complete, scoped to project |
| User | Get/update profile, change password |
| Dashboard | Aggregated stats and recent activity |

---

## Bonus Features (Optional)

- Dark mode
- Pagination
- Activity timeline
- Drag & drop tasks
- Project analytics
- Toast notifications
- Skeleton loaders
- Infinite scroll
- Unit tests

---

## Submission Checklist

- [ ] GitHub repository
- [ ] README.md (this file — update with screenshots and live links)
- [ ] Live deployment link (frontend)
- [ ] Live deployment link (backend/API)

### README must include
- Project setup & installation steps
- Environment variables
- Folder structure
- Screenshots
- Feature list

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

## Screenshots

> *Add screenshots here once the application is built and deployed.*

| Screen | Preview |
|--------|---------|
| Dashboard | *TBD* |
| Projects | *TBD* |
| Tasks | *TBD* |
| Profile | *TBD* |

---

## License

This project is built as a MERN stack assessment submission.
