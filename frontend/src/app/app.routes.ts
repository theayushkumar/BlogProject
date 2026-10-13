import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';
import { ArticleDetailComponent } from './pages/article-detail.component';
import { ArticleFormComponent } from './pages/article-form.component';
import { DashboardComponent } from './pages/dashboard.component';
import { HomeComponent } from './pages/home.component';
import { LoginComponent } from './pages/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'The Daily Edit' },
  { path: 'articles/:id', component: ArticleDetailComponent, title: 'Article' },
  { path: 'admin/login', component: LoginComponent, title: 'Admin sign in' },
  { path: 'admin', component: DashboardComponent, canActivate: [adminGuard], title: 'Dashboard' },
  { path: 'admin/articles/new', component: ArticleFormComponent, canActivate: [adminGuard], title: 'New article' },
  { path: 'admin/articles/:id/edit', component: ArticleFormComponent, canActivate: [adminGuard], title: 'Edit article' },
  { path: '**', redirectTo: '' }
];
