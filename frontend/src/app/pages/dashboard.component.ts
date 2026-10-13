import { DatePipe, SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '../core/article.model';
import { ArticleService } from '../core/article.service';

@Component({
  standalone: true,
  imports: [DatePipe, RouterLink, SlicePipe],
  template: `
    <section class="admin-page">
      <div class="admin-heading"><div><p class="eyebrow">The Daily Edit · Admin</p><h1>Your stories</h1><p class="form-intro">Manage the articles published on your blog.</p></div><a class="button button-dark" routerLink="/admin/articles/new">＋ New article</a></div>
      @if (error) { <p class="notice error">{{ error }}</p> }
      @if (!error && articles.length === 0) { <div class="empty-state"><span class="empty-mark">✳</span><h3>Your journal starts here.</h3><p>Write your first story and share it with the world.</p><a class="button button-dark" routerLink="/admin/articles/new">Write an article</a></div> }
      @if (articles.length > 0) {
        <div class="table-wrap"><table><thead><tr><th>Article</th><th>Publication date</th><th>Actions</th></tr></thead><tbody>
          @for (article of articles; track article.id) {
            <tr><td><a class="table-title" [routerLink]="['/articles', article.id]">{{ article.title }}</a><span class="table-excerpt">{{ article.content | slice:0:100 }}{{ article.content.length > 100 ? '…' : '' }}</span></td><td>{{ article.publicationDate | date:'MMM d, y' }}</td><td class="actions"><a [routerLink]="['/admin/articles', article.id, 'edit']">Edit</a><button class="text-button danger-text" (click)="remove(article)">Delete</button></td></tr>
          }
        </tbody></table></div>
      }
    </section>
  `
})
export class DashboardComponent {
  private readonly service = inject(ArticleService);
  articles: Article[] = [];
  error = '';

  constructor() { this.load(); }

  remove(article: Article): void {
    if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
    this.service.delete(article.id).subscribe({
      next: () => this.articles = this.articles.filter((item) => item.id !== article.id),
      error: () => this.error = 'The article could not be deleted. Please try again.'
    });
  }

  private load(): void {
    this.service.list().subscribe({
      next: (articles) => this.articles = articles,
      error: () => this.error = 'Articles could not be loaded. Please try again.'
    });
  }
}
