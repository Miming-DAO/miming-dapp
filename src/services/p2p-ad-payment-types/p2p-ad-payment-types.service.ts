import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { P2pAdPaymentType, CreateP2pAdPaymentTypeDto, UpdateP2pAdPaymentTypeDto } from '../../models/p2p-ad-payment-type.model';

@Injectable({
  providedIn: 'root'
})
export class P2pAdPaymentTypesService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = 'api/p2p-ad-payment-types';

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

  getP2pAdPaymentTypes(): Observable<P2pAdPaymentType[]> {
    return this.http.get<P2pAdPaymentType[]>(`${this.apiUrl}/${this.apiPrefix}`, {
      headers: this.getHeaders()
    });
  }

  getP2pAdPaymentTypesByP2pAd(p2p_ad_id: string): Observable<P2pAdPaymentType[]> {
    return this.http.get<P2pAdPaymentType[]>(`${this.apiUrl}/${this.apiPrefix}/by/p2p-ad/${p2p_ad_id}`, {
      headers: this.getHeaders()
    });
  }

  createP2pAdPaymentType(createDto: CreateP2pAdPaymentTypeDto): Observable<P2pAdPaymentType> {
    return this.http.post<P2pAdPaymentType>(`${this.apiUrl}/${this.apiPrefix}`, createDto, {
      headers: this.getHeaders()
    });
  }

  createManyP2pAdPaymentTypes(createDto: CreateP2pAdPaymentTypeDto): Observable<P2pAdPaymentType> {
    return this.http.post<P2pAdPaymentType>(`${this.apiUrl}/${this.apiPrefix}/many`, createDto, {
      headers: this.getHeaders()
    });
  }

  getP2pAdPaymentTypeById(id: string): Observable<P2pAdPaymentType> {
    return this.http.get<P2pAdPaymentType>(`${this.apiUrl}/${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateP2pAdPaymentType(id: string, updateDto: UpdateP2pAdPaymentTypeDto): Observable<P2pAdPaymentType> {
    return this.http.patch<P2pAdPaymentType>(`${this.apiUrl}/${this.apiPrefix}/${id}`, updateDto, {
      headers: this.getHeaders()
    });
  }

  deleteP2pAdPaymentType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
