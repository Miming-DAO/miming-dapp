import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { P2pAdsPayment, CreateP2pAdsPaymentDto, UpdateP2pAdsPaymentDto } from '../../models/p2p-ads-payment.model';

@Injectable({
  providedIn: 'root'
})
export class P2pAdsPaymentsService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = 'api/p2p-ads-payments';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const googleUser = localStorage.getItem('google_user');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (googleUser) {
      const userData = JSON.parse(googleUser);
      console.log(userData.token)
      if (userData.token) {
        headers = headers.set('Authorization', `Bearer ${userData.token}`);
      }
    }

    return headers;
  }

  getAdsPayments(): Observable<P2pAdsPayment[]> {
    return this.http.get<P2pAdsPayment[]>(`${this.apiUrl}${this.apiPrefix}`, {
      headers: this.getHeaders()
    });
  }

  createAdsPayment(createDto: CreateP2pAdsPaymentDto): Observable<P2pAdsPayment> {
    return this.http.post<P2pAdsPayment>(`${this.apiUrl}${this.apiPrefix}`, createDto, {
      headers: this.getHeaders()
    });
  }

  getAdsPaymentById(id: string | number): Observable<P2pAdsPayment> {
    return this.http.get<P2pAdsPayment>(`${this.apiUrl}${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateAdsPayment(id: string | number, updateDto: UpdateP2pAdsPaymentDto): Observable<P2pAdsPayment> {
    return this.http.patch<P2pAdsPayment>(`${this.apiUrl}${this.apiPrefix}/${id}`, updateDto, {
      headers: this.getHeaders()
    });
  }

  deleteAdsPayment(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
