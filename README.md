# Todo Demo — Gin + GORM + PostgreSQL + React + Ant Design

A minimal full-stack starter that demonstrates a classic CRUD flow.

- **Backend:** Gin (HTTP) + GORM (ORM) + PostgreSQL  
- **Frontend:** React (Vite) + Ant Design + Axios  
- **Infra (dev):** Docker Compose (PostgreSQL)

> Goal: get you from zero to a working, paginated Todo app with clean, readable code and a simple DX.

---

## Features

**Backend**
- RESTful CRUD for `/api/todos`
- Pagination (`page`, `page_size`)
- **PATCH** with partial updates (pointer fields)
- Auto-migration with GORM
- Dev-friendly CORS middleware
- Health check: `/api/health`

**Frontend**
- Add, toggle (done/undone), delete
- Paginated list with Ant Design `Pagination`
- Simple local state + Axios API client
- Vite dev server with proxy to backend

---

## Tech Stack

- **Go** 1.21+ (Gin, GORM)
- **PostgreSQL** 16 (via Docker)
- **Node** 18/20+ (React + Vite + AntD)
- **Axios** for HTTP

---

## Project Structure

```
gin-gorm-pg-react/
├─ docker-compose.yml
├─ backend/
│  ├─ main.go
│  └─ internal/
│     ├─ db/
│     │  └─ db.go
│     ├─ server/
│     │  └─ server.go
│     └─ todo/
│        ├─ model.go
│        ├─ handler.go
│        └─ dto.go
└─ frontend/
   ├─ vite.config.ts
   └─ src/
      ├─ api/
      │  ├─ client.ts
      │  └─ todo.ts
      ├─ types/
      │  └─ todo.ts
      └─ App.tsx
```

---

## Getting Started

### 1) Prerequisites
- Go 1.21+
- Node 18+ (or 20+)
- Docker & Docker Compose
- Git

### 2) Start PostgreSQL (dev)

From the repo root:

```bash
docker compose up -d
```

This starts a local Postgres 16 with:
- DB: `appdb`
- User: `appuser`
- Password: `secret`
- Port: `5432`

### 3) Backend (Gin + GORM)

Create `backend/.env`:

```dotenv
APP_PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=appuser
DB_PASSWORD=secret
DB_NAME=appdb
DB_SSLMODE=disable
```

Run:

```bash
cd backend
go run ./...
# Server: http://localhost:8080
# Health: http://localhost:8080/api/health
```

### 4) Frontend (React + AntD)

Install & run:

```bash
cd frontend
npm i
npm run dev
# Open http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:8080` (see `vite.config.ts`).

---

## API Reference

### Health

```
GET /api/health
200 OK
{
  "ok": true,
  "env": "8080"
}
```

### List Todos

```
GET /api/todos?page=1&page_size=10
200 OK
{
  "list": [ {Todo}, ... ],
  "page": 1,
  "page_size": 10,
  "total": 42,
  "total_page": 5
}
```

### Create Todo

```
POST /api/todos
Content-Type: application/json
{
  "title": "Buy milk"
}

201 Created
{Todo}
```

### Update Todo (partial)

```
PATCH /api/todos/:id
Content-Type: application/json
{
  "title": "Buy milk and bread",
  "done": true
}

200 OK
{Todo}
```

> Both `title` and `done` are optional in the PATCH body. Fields you omit won’t be overwritten.

### Delete Todo

```
DELETE /api/todos/:id
204 No Content
```

**Todo model**

```go
type Todo struct {
  ID        uint      `json:"id" gorm:"primaryKey"`
  Title     string    `json:"title"`
  Done      bool      `json:"done"`
  CreatedAt time.Time `json:"created_at"`
  UpdatedAt time.Time `json:"updated_at"`
}
```

---

## Quick cURL Examples

```bash
# Create
curl -X POST http://localhost:8080/api/todos   -H "Content-Type: application/json"   -d '{"title":"Buy milk"}'

# List
curl "http://localhost:8080/api/todos?page=1&page_size=10"

# Toggle done
curl -X PATCH http://localhost:8080/api/todos/1   -H "Content-Type: application/json"   -d '{"done":true}'

# Delete
curl -X DELETE http://localhost:8080/api/todos/1 -i
```

---

## Development Notes

- **CORS**: Opened broadly for development; tighten for production.
- **Ordering**: Todos listed by `created_at DESC`.
- **Pagination**: Returned as `page`, `page_size`, `total`, `total_page`.
- **Vite Proxy**: Use `/api/...` so requests are proxied to the Go server.

---

## Roadmap

- Filters: All / Active / Completed  
- Bulk actions: Clear completed  
- Centralized error handling & logging middleware  
- Config per environment (dev/prod)  
- Tests (backend handlers & frontend components)

---

## License

MIT
