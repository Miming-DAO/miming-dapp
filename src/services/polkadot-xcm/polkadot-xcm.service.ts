import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { PolkadotXcm } from '../../models/polkadot-xcm.model';

@Injectable({
  providedIn: 'root'
})
export class PolkadotXcmService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = '/api/polkadot-xcm';

  constructor(
    private http: HttpClient
  ) { }

  buildXcm(data: PolkadotXcm): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.apiPrefix}/build-xcm`, data, {});
  }
}
