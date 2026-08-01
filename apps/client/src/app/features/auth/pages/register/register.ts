import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  AuthService,
} from '../../';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly fb =
    inject(FormBuilder).nonNullable;

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

    readonly loading = signal(false);

readonly error = signal('');
  form = this.fb.group({
    email: [
      '',
      [Validators.required, Validators.email],
    ],
    password: [
      '',
      Validators.required,
    ],
  });

  submit(): void {

  if (this.form.invalid) {

    this.form.markAllAsTouched();

    return;

  }

  this.loading.set(true);

  this.error.set('');

  this.authService
    .register(this.form.getRawValue())
    .subscribe({

      next: () => {

        this.loading.set(false);

        this.router.navigateByUrl('/login');

      },

      error: (err: HttpErrorResponse) => {

        this.loading.set(false);

        if (err.status === 0) {

          this.error.set(
            'Unable to connect to the server. Please make sure the backend is running.'
          );

          return;

        }

        this.error.set(
          err.error?.message ??
          'Registration failed. Please try again.'
        );

      },

    });

}
}