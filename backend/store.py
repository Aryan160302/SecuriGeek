from __future__ import annotations
from threading import RLock
from typing import Dict, List, Optional, Tuple
from datetime import datetime

from .models import Issue, IssueCreate, IssueUpdate, IssuePriority, IssueStatus


class IssueStore:
    def __init__(self) -> None:
        self._lock = RLock()
        self._next_id = 1
        self._issues: Dict[int, Issue] = {}

    def _now(self) -> datetime:
        return datetime.utcnow()

    def create(self, payload: IssueCreate) -> Issue:
        with self._lock:
            issue_id = self._next_id
            self._next_id += 1
            now = self._now()
            issue = Issue(id=issue_id, createdAt=now, updatedAt=now, **payload.model_dump())
            self._issues[issue_id] = issue
            return issue

    def get(self, issue_id: int) -> Optional[Issue]:
        with self._lock:
            return self._issues.get(issue_id)

    def update(self, issue_id: int, payload: IssueUpdate) -> Optional[Issue]:
        with self._lock:
            existing = self._issues.get(issue_id)
            if not existing:
                return None
            data = existing.model_dump()
            updates = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
            data.update(updates)
            data["updatedAt"] = self._now()
            updated = Issue(**data)
            self._issues[issue_id] = updated
            return updated

    def list(self,
             search: Optional[str] = None,
             status: Optional[IssueStatus] = None,
             priority: Optional[IssuePriority] = None,
             assignee: Optional[str] = None,
             sort_by: Optional[str] = None,
             sort_dir: str = "desc",
             page: int = 1,
             page_size: int = 10) -> Tuple[List[Issue], int]:
        with self._lock:
            items = list(self._issues.values())

        if search:
            query = search.lower()
            items = [i for i in items if query in i.title.lower()]

        if status:
            items = [i for i in items if i.status == status]

        if priority:
            items = [i for i in items if i.priority == priority]

        if assignee:
            items = [i for i in items if (i.assignee or '').lower() == assignee.lower()]

        total = len(items)

        if sort_by:
            reverse = sort_dir.lower() != "asc"
            if sort_by in {"id", "title", "status", "priority", "assignee", "createdAt", "updatedAt"}:
                items.sort(key=lambda x: getattr(x, sort_by), reverse=reverse)

        if page < 1:
            page = 1
        if page_size < 1:
            page_size = 10

        start = (page - 1) * page_size
        end = start + page_size
        return items[start:end], total


store = IssueStore()


def seed_sample_data() -> None:
    examples = [
        IssueCreate(title="Login page crashes on submit", description="Steps to reproduce...", priority=IssuePriority.HIGH, status=IssueStatus.OPEN, assignee="alice"),
        IssueCreate(title="Typo in dashboard header", description="Fix spelling", priority=IssuePriority.LOW, status=IssueStatus.RESOLVED, assignee="bob"),
        IssueCreate(title="API latency spike", description="Investigate performance", priority=IssuePriority.CRITICAL, status=IssueStatus.IN_PROGRESS, assignee="carol"),
        IssueCreate(title="Dark mode toggle not working", description="", priority=IssuePriority.MEDIUM, status=IssueStatus.OPEN, assignee="alice"),
    ]
    for p in examples:
        store.create(p)

