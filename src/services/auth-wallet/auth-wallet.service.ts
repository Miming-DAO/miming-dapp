import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  GenerateNonce,
  GenerateNonceResponse,
  VerifySignature,
  VerifySignatureResponse
} from '../../models/auth-wallet.model';

@Injectable({
  providedIn: 'root',
})
export class AuthWalletService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = '/api/auth-wallet';

  constructor(
    private http: HttpClient
  ) { }

  generateNonce(generateNonce: GenerateNonce): Observable<GenerateNonceResponse> {
    return this.http.post<GenerateNonceResponse>(`${this.apiUrl}${this.apiPrefix}/request-nonce`, generateNonce);
  }

  verifySignature(verifySignature: VerifySignature): Observable<VerifySignatureResponse> {
    return this.http.post<VerifySignatureResponse>(`${this.apiUrl}${this.apiPrefix}/verify-signature`, verifySignature);
  }
}
