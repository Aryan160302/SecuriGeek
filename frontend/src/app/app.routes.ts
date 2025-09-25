import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./issues/issues-list.component').then(m => m.IssuesListComponent) },
  { path: 'issues/:id', loadComponent: () => import('./issues/issue-detail.component').then(m => m.IssueDetailComponent) },
];
