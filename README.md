# Issue Tracker (FastAPI + Angular)

A simple Issue Tracker with a Python FastAPI backend and an Angular frontend. Users can view, search, filter, sort, paginate, create, and update issues. Clicking a row opens the detail view; an Edit button opens the form.

## Prerequisites
- Python 3.11+ (3.10+ should also work)
- Node.js 18+ and npm

## 1) Backend (FastAPI)

1. Create a virtual environment and install dependencies
```bash
cd /Users/archhcra/Desktop/intern
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

2. Run the API server
```bash
uvicorn backend.main:app --reload --port 8000
```

3. Verify it is working
```bash
curl http://127.0.0.1:8000/health
# => {"status":"ok"}
```
Open interactive API docs: `http://127.0.0.1:8000/docs`

Notes
- Sample issues are auto-seeded at startup.
- Endpoints
  - GET `/health`
  - GET `/issues` (query: `search`, `status`, `priority`, `assignee`, `sortBy`, `sortDir`, `page`, `pageSize`)
  - GET `/issues/{id}`
  - POST `/issues`
  - PUT `/issues/{id}`

Example requests
```bash
# List issues (first page)
curl "http://127.0.0.1:8000/issues?page=1&pageSize=10&sortBy=updatedAt&sortDir=desc"

# Create an issue
curl -X POST "http://127.0.0.1:8000/issues" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New issue from curl",
    "description": "Repro steps...",
    "status": "open",
    "priority": "medium",
    "assignee": "me"
  }'

# Get single issue
curl "http://127.0.0.1:8000/issues/1"

# Update an issue
curl -X PUT "http://127.0.0.1:8000/issues/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "priority": "high"
  }'
```

## 2) Frontend (Angular)

1. Install dependencies
```bash
cd /Users/archhcra/Desktop/intern/frontend
npm install
```

2. Start the dev server
```bash
npm start
```
Open the app at: `http://127.0.0.1:4200`

The frontend is configured to call the backend at `http://127.0.0.1:8000`.

## Features
- Issues List table with columns: `id`, `title`, `status`, `priority`, `assignee`, `updatedAt`
- Filters: status, priority, assignee; text search on title
- Sorting: click any column header to sort
- Pagination: page and page size
- Create Issue button: opens form to add new issue
- Edit button: updates issue (row click opens detail view)
- Detail view: displays form and raw JSON

## Troubleshooting
- Port already in use (backend 8000 or frontend 4200)
```bash
lsof -i :8000   # or :4200
kill -9 <PID>
```
- CORS: Enabled on the backend for local development (allow all origins)
- Virtualenv not activated: ensure `source .venv/bin/activate` before `pip install`

## Project Structure
```
/Users/archhcra/Desktop/intern
├─ backend/              # FastAPI app (endpoints and in-memory store)
│  ├─ main.py            # FastAPI app and routes
│  ├─ models.py          # Pydantic models and enums
│  ├─ store.py           # Thread-safe in-memory store and seeding
│  └─ requirements.txt   # Python dependencies
├─ frontend/             # Angular app (standalone components)
│  └─ src/app/
│     ├─ services/issues.service.ts
│     ├─ issues/issues-list.component.*
│     └─ issues/issue-detail.component.*
└─ README.md             # This file
```

