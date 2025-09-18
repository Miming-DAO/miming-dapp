import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from './../../../environments/environment';

import { Token } from '../../../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class TokensService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = '/api/tokens';

  constructor(
    private http: HttpClient
  ) { }

  getAllTokens(): Observable<Token[]> {
    return this.http.get<Token[]>(`${this.apiUrl}${this.apiPrefix}`);
  }

  getTokensByChainId(chain_id: number): Observable<Token[]> {
    return this.http.get<Token[]>(`${this.apiUrl}${this.apiPrefix}/by_chain_id/${chain_id}`);
  }

  getTokenByChainReferenceId(chain_id: number, chain_ref_id: number): Observable<Token> {
    return this.http.get<Token>(`${this.apiUrl}${this.apiPrefix}/by_chain_and_ref_id/${chain_id}/${chain_ref_id}`);
  }
}
