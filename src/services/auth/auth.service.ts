import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { LoginDto, TokenResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = '/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * POST /api/auth/token
   * Authenticate user and get access token
   */
  login(loginDto: LoginDto): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}${this.apiPrefix}/token`, loginDto);
  }

  /**
   * GET /api/auth/google
   * Get Google OAuth URL
   */
  getGoogleAuthUrl(): string {
    return `${this.apiUrl}${this.apiPrefix}-google`;
  }

  /**
   * GET /api/auth/google/callback
   * Handle Google OAuth callback
   */
  handleGoogleCallback(code: string): Observable<TokenResponse> {
    return this.http.get<TokenResponse>(`${this.apiUrl}${this.apiPrefix}/google/callback`, {
      params: { code }
    });
  }
}
