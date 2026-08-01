import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../auth.service';
import { AuthStore } from '../../auth.store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder).nonNullable;

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  private readonly authStore = inject(AuthStore);
  readonly loading = this.authStore.loading;
  readonly error = signal('');
  form = this.fb.group({
    email: ['test@test.com', [Validators.required, Validators.email]],

    password: ['123456', Validators.required],
  });

  submit(): void {

  if (this.form.invalid) {

    this.form.markAllAsTouched();

    return;

  }

  this.authStore.setLoading(true);

  this.error.set('');

  this.authService
    .login(this.form.getRawValue())
    .pipe(
      finalize(() => {
        this.authStore.setLoading(false);
      })
    )
    .subscribe({

      next: (response) => {

        this.authStore.setUser(response.data);

        this.router.navigateByUrl('/dashboard');

      },

      error: (error) => {

        console.error(error);

        if (error.status === 0) {

          this.error.set(
            'Unable to connect to the server. Please make sure the backend is running.'
          );

          return;

        }

        this.error.set(
          error.error?.message ??
          'Login failed. Please try again.'
        );

      },

    });

}
}
