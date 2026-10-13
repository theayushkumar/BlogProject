import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article, ArticleInput } from './article.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/articles';

  list(): Observable<Article[]> {
    return this.http.get<Article[]>(this.baseUrl);
  }

  get(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/${id}`);
  }

  create(article: ArticleInput): Observable<Article> {
    return this.http.post<Article>(this.baseUrl, article);
  }

  update(id: number, article: ArticleInput): Observable<Article> {
    return this.http.put<Article>(`${this.baseUrl}/${id}`, article);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
