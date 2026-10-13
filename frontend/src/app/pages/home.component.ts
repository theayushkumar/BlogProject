import { DatePipe, SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '../core/article.model';
import { ArticleService } from '../core/article.service';

@Component({
  standalone: true,
  imports: [DatePipe, RouterLink, SlicePipe],
  template: `
    <section class="hero">
      <p class="eyebrow">Ideas worth your time</p>
      <h1>A little more <em>meaning</em><br />in your reading.</h1>
      <p class="hero-copy">Notes, perspectives, and stories for a more curious day.</p>
    </section>
    <section class="article-section">
      <div class="section-heading"><div><p class="eyebrow">The journal</p><h2>Latest stories</h2></div><span>{{ articles.length }} stories</span></div>
      @if (error) { <p class="notice error">{{ error }}</p> }
      @if (!error && articles.length === 0) {
        <div class="empty-state"><span class="empty-mark">✳</span><h3>Your next favorite read is on its way.</h3><p>There are no stories published just yet. Check back soon.</p></div>
      } @else {
        <div class="article-grid">
          @for (article of articles; track article.id; let i = $index) {
            <a class="article-card" [routerLink]="['/articles', article.id]">
              <div class="card-art" [class]="'card-art art-' + (i % 4)"><span>{{ (i + 1).toString().padStart(2, '0') }}</span><span class="art-symbol">{{ i % 2 === 0 ? '✳' : '✺' }}</span></div>
              <p class="article-date">{{ article.publicationDate | date:'MMMM d, y' }}</p>
              <h3>{{ article.title }}</h3><p class="card-excerpt">{{ article.content | slice:0:150 }}{{ article.content.length > 150 ? '…' : '' }}</p>
              <span class="read-link">Read story <span aria-hidden="true">↗</span></span>
            </a>
          }
        </div>
      }
    </section>
  `
})
export class HomeComponent {
  private readonly service = inject(ArticleService);
  articles: Article[] = [];
  error = '';

  constructor() {
    this.service.list().subscribe({
      next: (articles) => this.articles = articles,
      error: () => this.error = 'Stories could not be loaded. Please try again later.'
    });
  }
}
