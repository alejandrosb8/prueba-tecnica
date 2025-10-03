import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from '../tokens';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly api = inject(API_URL);

  private readonly tokenKey = 'access_token';
  private readonly emailKey = 'user_email';

  // Local auth state using signals
  private readonly tokenSignal = signal<string | null>(
    typeof localStorage !== 'undefined' ? localStorage.getItem(this.tokenKey) : null
  );
  private readonly emailSignal = signal<string | null>(
    typeof localStorage !== 'undefined' ? localStorage.getItem(this.emailKey) : null
  );

  readonly isLoggedIn = computed(() => !!this.tokenSignal());
  readonly token = computed(() => this.tokenSignal());
  readonly email = computed(() => this.emailSignal());

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.api}/auth/login`, payload).pipe(
      tap((res) => {
        this.setToken(res.access_token);
        this.setEmail(payload.email);
      })
    );
  }

  register(payload: RegisterRequest) {
    return this.http.post<RegisterResponse>(`${this.api}/auth/register`, payload);
  }

  logout() {
    this.clearToken();
    this.clearEmail();
    this.router.navigateByUrl('/login');
  }

  private setToken(token: string) {
    this.tokenSignal.set(token);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private clearToken() {
    this.tokenSignal.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  private setEmail(email: string) {
    this.emailSignal.set(email);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.emailKey, email);
    }
  }

  private clearEmail() {
    this.emailSignal.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.emailKey);
    }
  }
}
