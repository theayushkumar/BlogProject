import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <header class="site-header">
      <a class="brand" routerLink="/">The Daily Edit<span>.</span></a>
      <nav aria-label="Main navigation">
        <a routerLink="/">Stories</a>
        @if (auth.isAuthenticated()) {
          <a routerLink="/admin">Dashboard</a>
          <button class="nav-button" (click)="logout()">Sign out</button>
        } @else {
          <a class="admin-link" routerLink="/admin/login">Admin</a>
        }
      </nav>
    </header>
    <main><router-outlet /></main>
    <footer class="site-footer">Thoughtful stories, published with care.</footer>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/');
  }
}
