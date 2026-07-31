import {
  Injectable,
  computed,
  signal
} from '@angular/core';

import { User } from '../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {

  private readonly _user =
    signal<User | null>(null);

  private readonly _loading =
    signal(false);

  readonly user =
    this._user.asReadonly();

  readonly loading =
    this._loading.asReadonly();

  readonly isAuthenticated =
    computed(() => this.user() !== null);

  setUser(user: User): void {
    this._user.set(user);
  }

  clearUser(): void {
    this._user.set(null);
  }

  setLoading(
    loading: boolean
  ): void {
    this._loading.set(loading);
  }

}