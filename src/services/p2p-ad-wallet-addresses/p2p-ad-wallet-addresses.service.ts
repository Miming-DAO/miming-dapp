import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { P2pAdWalletAddress, CreateP2pAdWalletAddressDto, UpdateP2pAdWalletAddressDto } from '../../models/p2p-ad-wallet-address.model';

@Injectable({
  providedIn: 'root',
})
export class P2pAdWalletAddressesService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = 'api/p2p-ad-wallet-addresses';

  constructor(
    private http: HttpClient
  ) { }

  private getHeaders(): HttpHeaders {
    const googleUser = localStorage.getItem('auth_user');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (googleUser) {
      const userData = JSON.parse(googleUser);
      if (userData.access_token) {
        headers = headers.set('Authorization', `Bearer ${userData.access_token}`);
      }
    }

    return headers;
  }

  getP2pAdWalletAddresses(): Observable<P2pAdWalletAddress[]> {
    return this.http.get<P2pAdWalletAddress[]>(`${this.apiUrl}/${this.apiPrefix}`, {
      headers: this.getHeaders()
    });
  }

  getP2pAdWalletAddressesByP2pAd(p2p_ad_id: string): Observable<P2pAdWalletAddress[]> {
    return this.http.get<P2pAdWalletAddress[]>(`${this.apiUrl}/${this.apiPrefix}/by/p2p-ad/${p2p_ad_id}`, {
      headers: this.getHeaders()
    });
  }

  createP2pAdWalletAddress(createDto: CreateP2pAdWalletAddressDto): Observable<P2pAdWalletAddress> {
    return this.http.post<P2pAdWalletAddress>(`${this.apiUrl}/${this.apiPrefix}`, createDto, {
      headers: this.getHeaders()
    });
  }

  createManyP2pAdWalletAddresses(createDtos: CreateP2pAdWalletAddressDto[]): Observable<P2pAdWalletAddress[]> {
    return this.http.post<P2pAdWalletAddress[]>(`${this.apiUrl}/${this.apiPrefix}/many`, createDtos, {
      headers: this.getHeaders()
    });
  }

  getP2pAdWalletAddressById(id: string): Observable<P2pAdWalletAddress> {
    return this.http.get<P2pAdWalletAddress>(`${this.apiUrl}/${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateP2pAdWalletAddress(id: string, updateDto: UpdateP2pAdWalletAddressDto): Observable<P2pAdWalletAddress> {
    return this.http.patch<P2pAdWalletAddress>(`${this.apiUrl}/${this.apiPrefix}/${id}`, updateDto, {
      headers: this.getHeaders()
    });
  }

  deleteP2pAdWalletAddress(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }

  deleteP2pAdWalletAddressesByP2pAd(p2p_ad_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.apiPrefix}/many/by/p2p-ad/${p2p_ad_id}`, {
      headers: this.getHeaders()
    });
  }
}
