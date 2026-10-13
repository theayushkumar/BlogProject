import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Article } from '../core/article.model';
import { ArticleService } from '../core/article.service';

@Component({
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <div class="article-detail">
      <a class="back-link" routerLink="/">← All stories</a>
      @if (error) { <div class="notice error">{{ error }}</div> }
      @if (article) {
        <header class="article-header"><p class="eyebrow">The journal · {{ article.publicationDate | date:'MMMM d, y' }}</p><h1>{{ article.title }}</h1><div class="article-rule"></div></header>
        <div class="article-body">{{ article.content }}</div>
        <div class="article-end">✳</div>
      }
    </div>
  `
})
export class ArticleDetailComponent {
  private readonly service = inject(ArticleService);
  article?: Article;
  error = '';

  constructor() {
    const id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id < 1) {
      this.error = 'This story could not be found.';
    } else {
      this.service.get(id).subscribe({
        next: (article) => this.article = article,
        error: () => this.error = 'This story could not be found.'
      });
    }
  }
}
