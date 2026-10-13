import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService } from '../core/article.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="form-page">
      <a class="back-link" routerLink="/admin">← Back to dashboard</a>
      <div class="form-heading"><p class="eyebrow">The Daily Edit · Admin</p><h1>{{ editing ? 'Edit your story.' : 'A new story.' }}</h1><p class="form-intro">{{ editing ? 'Make your changes below.' : 'Every good story starts somewhere.' }}</p></div>
      @if (error) { <p class="notice error">{{ error }}</p> }
      <form [formGroup]="form" (ngSubmit)="save()" class="article-form">
        <label for="title">Title</label><input id="title" formControlName="title" maxlength="200" placeholder="Give your story a title" />
        @if (form.controls.title.touched && form.controls.title.invalid) { <small class="field-error">Enter a title (up to 200 characters).</small> }
        <label for="publicationDate">Date of publication</label><input id="publicationDate" type="date" formControlName="publicationDate" />
        <label for="content">Content</label><textarea id="content" rows="14" formControlName="content" placeholder="Tell your story…"></textarea>
        @if (form.controls.content.touched && form.controls.content.invalid) { <small class="field-error">Article content is required.</small> }
        <div class="form-actions"><button class="button button-dark" type="submit" [disabled]="busy || loading || form.invalid || (routeHasId && !editing)">{{ busy ? 'Saving…' : (editing ? 'Save changes' : 'Publish article') }}</button><a class="button button-light" routerLink="/admin">Cancel</a></div>
      </form>
    </section>
  `
})
export class ArticleFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ArticleService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly routeHasId = this.route.snapshot.paramMap.has('id');
  readonly id = Number(this.route.snapshot.paramMap.get('id'));
  readonly editing = this.routeHasId && Number.isSafeInteger(this.id) && this.id > 0;
  busy = false;
  loading = this.routeHasId && this.editing;
  error = '';
  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    content: ['', Validators.required],
    publicationDate: [
      new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10),
      Validators.required
    ]
  });

  constructor() {
    if (this.routeHasId) {
      if (!this.editing) this.error = 'Invalid article identifier.';
      else this.service.get(this.id).subscribe({
        next: (article) => {
          this.form.setValue({ title: article.title, content: article.content, publicationDate: article.publicationDate });
          this.loading = false;
        },
        error: () => { this.error = 'The article could not be found.'; this.loading = false; }
      });
    }
  }

  save(): void {
    if (this.form.invalid || this.busy || this.loading || (this.routeHasId && !this.editing)) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy = true;
    this.error = '';
    const operation = this.editing ? this.service.update(this.id, this.form.getRawValue()) : this.service.create(this.form.getRawValue());
    operation.subscribe({
      next: () => void this.router.navigateByUrl('/admin'),
      error: () => { this.error = 'The article could not be saved. Please try again.'; this.busy = false; }
    });
  }
}
