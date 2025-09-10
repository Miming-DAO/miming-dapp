import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { LimitedReserveTransferAssets } from '../../../models/limited-reserve-transfer-assets.model';
import { ExecuteTransaction } from '../../../models/execute-transactions.model';

@Injectable({
  providedIn: 'root'
})
export class PolkadotXcmService {
  private apiUrl = 'http://192.168.0.190:3000';
  private apiPrefix = '/api/polkadot-xcm';

  constructor(
    private http: HttpClient
  ) { }

  limitedReserveTransferAssets(
    sourceParaId: number,
    data: LimitedReserveTransferAssets
  ): Observable<any> {
    const params = new HttpParams().set('sourceParaId', sourceParaId.toString());
    return this.http.post(`${this.apiUrl}${this.apiPrefix}/limited-reserve-transfer-assets`, data, { params });
  }

  executeTransaction(
    sourceParaId: number,
    data: ExecuteTransaction
  ): Observable<any> {
    const params = new HttpParams().set('sourceParaId', sourceParaId.toString());
    return this.http.post(`${this.apiUrl}${this.apiPrefix}/execute-transaction`, data, { params });
  }
}
