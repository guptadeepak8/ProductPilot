import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  const api = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('logs in successfully', () => {
    const payload = { email: 'user@example.com', password: 'secret123' };
    const response = {
      success: true,
      message: 'Login successful',
      data: { id: 1, email: payload.email },
    };

    service.login(payload).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = http.expectOne(`${api}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(response);
  });

  it('surfaces login failure', () => {
    const payload = { email: 'user@example.com', password: 'wrongpass' };

    service.login(payload).subscribe({
      next: () => {
        throw new Error('expected login to fail');
      },
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.error.message).toBe('Invalid email or password');
      },
    });

    const req = http.expectOne(`${api}/login`);
    req.flush({ message: 'Invalid email or password' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('registers successfully', () => {
    const payload = { email: 'new@example.com', password: 'secret123' };
    const response = {
      success: true,
      message: 'User registered successfully',
      data: { id: 2, email: payload.email },
    };

    service.register(payload).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = http.expectOne(`${api}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(response);
  });
});
