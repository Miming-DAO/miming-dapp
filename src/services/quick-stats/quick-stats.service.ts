import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { QuickStats } from '../../models/quick-stats.model';

@Injectable({
  providedIn: 'root'
})
export class QuickStatsService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = '/api/quick-stats';

  constructor(
    private http: HttpClient
  ) { }

  getQuickStats(): Observable<QuickStats> {
    return this.http.get<QuickStats>(`${this.apiUrl}${this.apiPrefix}`);
  }
}
