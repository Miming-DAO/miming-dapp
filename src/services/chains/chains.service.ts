import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Chain } from '../../models/chain.model';

@Injectable({
  providedIn: 'root'
})
export class ChainsService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = '/api/chains';

  constructor(
    private http: HttpClient
  ) { }

  getChainsByNetworkId(network_id: number): Observable<Chain[]> {
    return this.http.get<Chain[]>(`${this.apiUrl}${this.apiPrefix}/by_network_id/${network_id}`);
  }
}
