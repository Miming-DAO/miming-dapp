import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { LimitedReserveTransferAssets } from '../../../models/limited-reserve-transfer-assets.model';
import { ExecuteTransaction } from '../../../models/execute-transactions.model';

@Injectable({
  providedIn: 'root'
})
export class PolkadotXcmService {
  private apiUrl = 'http://localhost:3000';
  private apiPrefix = '/api/polkadot-xcm';

  constructor(
    private http: HttpClient
  ) { }

  limitedReserveTransferAssets(data: LimitedReserveTransferAssets): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.apiPrefix}/limited-reserve-transfer-assets`, data, {});
  }

  executeTransaction(data: ExecuteTransaction): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.apiPrefix}/execute-transaction`, data, {});
  }
}
