import { Component, inject } from '@angular/core';
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

import {
  AuthService,
} from '../../';

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
    MatButtonModule
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

    this.authService
      .register(this.form.getRawValue())
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/login');
        },

        error: (err) => {
          console.error(err);
        },
      });
  }
}