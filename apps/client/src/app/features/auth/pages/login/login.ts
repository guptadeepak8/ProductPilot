import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../auth.service';
import { AuthStore } from '../../auth.store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder).nonNullable;

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  private readonly authStore = inject(AuthStore);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],

    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.authStore.setLoading(true);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.authStore.setUser(response.data);

        this.authStore.setLoading(false);

        console.log(response);

        this.router.navigateByUrl('/dashboard');
      },

      error: (error) => {
        console.error(error);

        this.authStore.setLoading(false);
      },
    });
  }
}
