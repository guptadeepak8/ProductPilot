import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../shared/types';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

private readonly http =
    inject(HttpClient);

  private readonly api =
    `${environment.apiUrl}/auth`;

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(
      `${this.api}/login`,
      data
    );
  }

  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(
      `${this.api}/register`,
      data
    );
  }

  me() {
    return this.http.get<AuthResponse>(
      `${this.api}/me`
    );
  }

  logout() {
    return this.http.post(
      `${this.api}/logout`,
      {}
    );
  }
}

