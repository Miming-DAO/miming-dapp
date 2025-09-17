import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ExecuteTransaction } from '../../../models/execute-transactions.model';

@Injectable({
  providedIn: 'root'
})
export class PolkadotApiService {
  private apiUrl = 'http://localhost:3000';
  private apiPrefix = '/api/polkadot-api';

  constructor(
    private http: HttpClient
  ) { }

  executeTransaction(data: ExecuteTransaction): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.apiPrefix}/execute-transaction`, data, {});
  }
}
