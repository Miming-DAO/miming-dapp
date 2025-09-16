import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { PolkadotXcm } from '../../../models/polkadot-xcm.model';

@Injectable({
  providedIn: 'root'
})
export class PolkadotXcmService {
  private apiUrl = 'http://localhost:3000';
  private apiPrefix = '/api/polkadot-xcm';

  constructor(
    private http: HttpClient
  ) { }

  buildXcm(data: PolkadotXcm): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.apiPrefix}/build-xcm`, data, {});
  }
}
