import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export interface Issue {
  id: number;
  title: string;
  description?: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  assignee?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueCreate {
  title: string;
  description?: string | null;
  status?: IssueStatus;
  priority?: IssuePriority;
  assignee?: string | null;
}

export interface IssueUpdate {
  title?: string;
  description?: string | null;
  status?: IssueStatus;
  priority?: IssuePriority;
  assignee?: string | null;
}

export interface PagedIssues {
  items: Issue[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class IssuesService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000';

  list(options: {
    search?: string;
    status?: IssueStatus;
    priority?: IssuePriority;
    assignee?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  } = {}): Observable<PagedIssues> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return this.http.get<PagedIssues>(`${this.baseUrl}/issues`, { params });
  }

  get(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.baseUrl}/issues/${id}`);
  }

  create(payload: IssueCreate): Observable<Issue> {
    return this.http.post<Issue>(`${this.baseUrl}/issues`, payload);
  }

  update(id: number, payload: IssueUpdate): Observable<Issue> {
    return this.http.put<Issue>(`${this.baseUrl}/issues/${id}`, payload);
  }
}

