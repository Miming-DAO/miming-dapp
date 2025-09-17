import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Network } from '../../../models/network.model';

@Injectable({
  providedIn: 'root'
})
export class NetworksService {
  private apiUrl = 'http://localhost:3000';
  private apiPrefix = '/api/networks';

  constructor(
    private http: HttpClient
  ) { }

  getAllNetworks(): Observable<Network[]> {
    return this.http.get<Network[]>(`${this.apiUrl}${this.apiPrefix}`);
  }
}
