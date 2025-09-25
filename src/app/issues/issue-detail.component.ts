import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IssuesService, Issue, IssueCreate, IssuePriority, IssueStatus } from '../services/issues.service';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css'],
})
export class IssueDetailComponent implements OnInit {
  private service = inject(IssuesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = 0;
  model: Issue | IssueCreate = { title: '', description: '', priority: 'medium', status: 'open', assignee: '' };
  isNew = false;
  loading = false;

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isNew = !this.id;
    if (!this.isNew) {
      this.loading = true;
      this.service.get(this.id).subscribe((issue) => {
        this.model = issue;
        this.loading = false;
      });
    }
  }

  save() {
    if (this.isNew) {
      this.service.create(this.model as IssueCreate).subscribe((created) => {
        this.router.navigate(['/']);
      });
    } else {
      const { id, createdAt, ...rest } = this.model as Issue; // backend controls these
      this.service.update(this.id, rest).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}

