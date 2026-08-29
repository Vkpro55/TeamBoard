# TeamBoard

A collaborative project & task management app — create projects, organize tasks, and track progress across your team.

---

## Features

- **Auth** — JWT access/refresh tokens, httpOnly refresh cookie, persistent sessions ("Remember me")
- **Projects** — create, update, archive, delete, with per-owner stats and pagination
- **Tasks** — priority, status, and due dates, with server-side search, filter, and sort
- **Dashboard** — live totals and a recent-activity feed
- **Profile** — editable name, profile photo upload, password change
- **Responsive UI** — collapsible sidebar, empty/loading/error states, toast notifications, confirmation dialogs on delete

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19 (Vite), React Router, Tailwind CSS v4 |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh), Zod validation |
| Infra | Docker, Docker Compose, GitHub Actions CI/CD |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or remote)

### Setup

```bash
git clone https://github.com/<your-org>/teamboard.git
cd teamboard
```

**Backend**
```bash
cd Backend
npm install
# create .env with the values below
npm run dev             # http://localhost:3000
```

**Frontend**
```bash
cd Frontend
npm install
npm run dev             # http://localhost:5173
```

### Environment Variables

`Backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/teamboard
JWT_ACCESS_SECRET=replace_with_a_long_random_string
JWT_REFRESH_SECRET=replace_with_a_different_long_random_string
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

`Frontend/.env` (optional — defaults to `http://localhost:3000`):
```env
VITE_API_URL=http://localhost:3000
```

> Never commit a real `.env` file. Rotate the secrets above if one ever was.

---

## Running with Docker

```bash
docker compose up -d
```

This builds and runs MongoDB, the backend API, and the frontend (served via nginx) as a single stack. See [`compose.yaml`](compose.yaml) for the service definitions and required environment variables.

Production images are built and pushed automatically via [GitHub Actions](.github/workflows/ci-cd.yaml) on every push to `main`.

---

## API

The backend exposes a REST API under `/api` — auth, projects, tasks, dashboard, and user profile endpoints. All routes except signup/login/refresh require a bearer access token.

---