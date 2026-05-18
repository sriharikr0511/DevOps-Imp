# Task Manager — Full Stack Docker Demo

A simple Task Manager app built with **React**, **Node.js + Express**, and **PostgreSQL**, fully containerized with Docker Compose.

## Stack

| Layer    | Technology           |
|----------|----------------------|
| Frontend | React 18 + Vite      |
| Backend  | Node.js + Express    |
| Database | PostgreSQL 16        |
| Proxy    | Nginx (in prod)      |
| DevOps   | Docker + Compose     |

## Project Structure

```
taskmanager/
├── docker-compose.yml       ← orchestrates all services
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── index.js             ← Express REST API
└── frontend/
    ├── Dockerfile           ← multi-stage build
    ├── nginx.conf           ← proxies /tasks → backend
    ├── vite.config.js
    └── src/
        ├── App.jsx
        └── index.css
```

## Running the Project

### Prerequisites
- Docker Desktop installed and running

### Start everything
```bash
docker compose up --build
```

Open http://localhost:3000 in your browser.

### Stop everything
```bash
docker compose down
```

### Stop and wipe the database
```bash
docker compose down -v
```

## API Endpoints

| Method | Path         | Description          |
|--------|--------------|----------------------|
| GET    | /tasks       | List all tasks       |
| POST   | /tasks       | Create a task        |
| PATCH  | /tasks/:id   | Toggle done/undone   |
| DELETE | /tasks/:id   | Delete a task        |
| GET    | /health      | Health check         |

### Example
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Deploy to production"}'
```

## Docker Highlights

- **Multi-stage frontend build** — Node builds the React app, Nginx serves the static files (smaller final image)
- **Health check** — Compose waits for Postgres to be ready before starting the backend
- **Named volume** — `pg_data` persists your database across restarts
- **Service networking** — containers talk by service name (`backend`, `db`) via Docker's internal network

## Pushing to Docker Hub

```bash
# Build and tag images
docker build -t yourusername/taskmanager-backend ./backend
docker build -t yourusername/taskmanager-frontend ./frontend

# Push
docker push yourusername/taskmanager-backend
docker push yourusername/taskmanager-frontend
```
