import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="login-wrap">
      <a class="back-link" routerLink="/">← Back to stories</a>
      <div class="login-card"><p class="eyebrow">The Daily Edit · Admin</p><h1>Welcome back.</h1><p class="form-intro">Sign in to manage your stories.</p>
        @if (error) { <p class="notice error">{{ error }}</p> }
        <form (ngSubmit)="submit()">
          <label for="username">Username</label><input id="username" name="username" [(ngModel)]="username" autocomplete="username" required />
          <label for="password">Password</label><input id="password" name="password" type="password" [(ngModel)]="password" autocomplete="current-password" required />
          <button class="button button-dark" type="submit" [disabled]="busy || !username || !password">{{ busy ? 'Signing in…' : 'Sign in' }}</button>
        </form>
      </div>
    </section>
  `
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  username = '';
  password = '';
  busy = false;
  error = '';

  submit(): void {
    this.busy = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => void this.router.navigateByUrl('/admin'),
      error: () => { this.error = 'Sign-in failed. Check your credentials and try again.'; this.busy = false; }
    });
  }
}
