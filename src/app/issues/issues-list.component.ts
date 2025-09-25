import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IssuesService, Issue, IssuePriority, IssueStatus } from '../services/issues.service';

@Component({
  selector: 'app-issues-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.css'],
})
export class IssuesListComponent implements OnInit {
  private service = inject(IssuesService);
  private router = inject(Router);

  search = '';
  status: IssueStatus | '' = '';
  priority: IssuePriority | '' = '';
  assignee = '';
  sortBy = 'updatedAt';
  sortDir: 'asc' | 'desc' = 'desc';
  page = 1;
  pageSize = 10;

  loading = false;
  items: Issue[] = [];
  total = 0;

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.service
      .list({
        search: this.search || undefined,
        status: (this.status as IssueStatus) || undefined,
        priority: (this.priority as IssuePriority) || undefined,
        assignee: this.assignee || undefined,
        sortBy: this.sortBy,
        sortDir: this.sortDir,
        page: this.page,
        pageSize: this.pageSize,
      })
      .subscribe((res) => {
        this.items = res.items;
        this.total = res.total;
        this.loading = false;
      });
  }

  resetFilters() {
    this.search = '';
    this.status = '';
    this.priority = '';
    this.assignee = '';
    this.page = 1;
    this.load();
  }

  changeSort(field: string) {
    if (this.sortBy === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDir = 'asc';
    }
    this.load();
  }

  onPageChange(page: number) {
    this.page = page;
    this.load();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.page = 1;
    this.load();
  }

  openDetail(issue: Issue) {
    this.router.navigate(['/issues', issue.id]);
  }

  openCreate() {
    this.router.navigate(['/issues', 0]);
  }

  openEdit(issue: Issue, event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['/issues', issue.id]);
  }
}

