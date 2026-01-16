import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { User, CreateUserDto } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private apiPrefix = '/api/users';

  /**
   * GET /api/users
   * Get all users
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}${this.apiPrefix}`);
  }

  /**
   * POST /api/users
   * Create a new user
   */
  createUser(createUserDto: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}${this.apiPrefix}`, createUserDto);
  }

  /**
   * GET /api/users/{id}
   * Get user by ID
   */
  getUserById(id: string | number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${this.apiPrefix}/${id}`);
  }

  /**
   * GET /api/users/by-email/{email}
   * Get user by email
   */
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${this.apiPrefix}/by-email/${email}`);
  }
}
