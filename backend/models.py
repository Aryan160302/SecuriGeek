from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


class IssueStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class IssuePriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IssueCreate(BaseModel):
    title: str = Field(min_length=1)
    description: Optional[str] = None
    status: IssueStatus = IssueStatus.OPEN
    priority: IssuePriority = IssuePriority.MEDIUM
    assignee: Optional[str] = None


class IssueUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1)
    description: Optional[str] = None
    status: Optional[IssueStatus] = None
    priority: Optional[IssuePriority] = None
    assignee: Optional[str] = None


class Issue(IssueCreate):
    id: int
    createdAt: datetime
    updatedAt: datetime

