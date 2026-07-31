import { Component, inject, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../features/auth';
import { AuthStore } from '../../features/auth/auth.store';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  public readonly authStore = inject(AuthStore);

  ngOnInit(): void {
    this.authStore.setLoading(true);

    this.authService
      .me()
      .pipe(finalize(() => this.authStore.setLoading(false)))
      .subscribe({
        next: (response) => {
          this.authStore.setUser(response.data);
        },
        error: () => {
          this.authStore.clearUser();
          this.router.navigate(['/login']);
        },
      });
  }
}
