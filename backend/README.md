# Issue Tracker Backend (FastAPI)

## Setup
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

## Run
```bash
uvicorn backend.main:app --reload --port 8000
```

## Endpoints
- GET `/health`
- GET `/issues` (query: `search`, `status`, `priority`, `assignee`, `sortBy`, `sortDir`, `page`, `pageSize`)
- GET `/issues/{id}`
- POST `/issues`
- PUT `/issues/{id}`

