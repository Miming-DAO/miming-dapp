import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Login, TokenResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = '/api/auth';

  constructor(
    private http: HttpClient
  ) { }

  login(login: Login): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}${this.apiPrefix}/token`, login);
  }
}
