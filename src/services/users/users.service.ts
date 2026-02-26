import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = '/api/users';

  constructor(
    private http: HttpClient
  ) { }

  private getHeaders(): HttpHeaders {
    const googleUser = localStorage.getItem('auth_user');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (googleUser) {
      const userData = JSON.parse(googleUser);
      if (userData.access_token) {
        headers = headers.set('Authorization', `Bearer ${userData.access_token}`);
      }
    }

    return headers;
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}${this.apiPrefix}`, {
      headers: this.getHeaders()
    });
  }

  getUserById(id: string | number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${this.apiPrefix}/by-email/${email}`, {
      headers: this.getHeaders()
    });
  }

  makeAdmin(id: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}${this.apiPrefix}/make-admin/${id}`, {}, {
      headers: this.getHeaders()
    });
  }

  makeMerchant(id: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}${this.apiPrefix}/make-merchant/${id}`, {}, {
      headers: this.getHeaders()
    });
  }

  makeUser(id: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}${this.apiPrefix}/make-user/${id}`, {}, {
      headers: this.getHeaders()
    });
  }
}
