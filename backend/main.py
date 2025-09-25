from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from .models import Issue, IssueCreate, IssueUpdate, IssuePriority, IssueStatus
from .store import store, seed_sample_data

app = FastAPI(title="Issue Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    seed_sample_data()


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/issues")
async def list_issues(
    search: Optional[str] = Query(default=None),
    status: Optional[IssueStatus] = Query(default=None),
    priority: Optional[IssuePriority] = Query(default=None),
    assignee: Optional[str] = Query(default=None),
    sortBy: Optional[str] = Query(default=None),
    sortDir: str = Query(default="desc"),
    page: int = Query(default=1, ge=1),
    pageSize: int = Query(default=10, ge=1, le=100),
):
    items, total = store.list(
        search=search,
        status=status,
        priority=priority,
        assignee=assignee,
        sort_by=sortBy,
        sort_dir=sortDir,
        page=page,
        page_size=pageSize,
    )
    return {
        "items": [i.model_dump() for i in items],
        "total": total,
        "page": page,
        "pageSize": pageSize,
    }


@app.get("/issues/{issue_id}")
async def get_issue(issue_id: int):
    issue = store.get(issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue


@app.post("/issues", status_code=201)
async def create_issue(payload: IssueCreate):
    issue = store.create(payload)
    return issue


@app.put("/issues/{issue_id}")
async def update_issue(issue_id: int, payload: IssueUpdate):
    updated = store.update(issue_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Issue not found")
    return updated

