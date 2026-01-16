import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { P2pAdsPayment, CreateP2pAdsPaymentDto, UpdateP2pAdsPaymentDto } from '../../models/p2p-ads-payment.model';

@Injectable({
  providedIn: 'root'
})
export class P2pAdsPaymentsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private apiPrefix = '/p2p-ads-payments';

  /**
   * GET /p2p-ads-payments
   * Get all ads payments
   */
  getAdsPayments(): Observable<P2pAdsPayment[]> {
    return this.http.get<P2pAdsPayment[]>(`${this.apiUrl}${this.apiPrefix}`);
  }

  /**
   * POST /p2p-ads-payments
   * Create a new ads payment
   */
  createAdsPayment(createDto: CreateP2pAdsPaymentDto): Observable<P2pAdsPayment> {
    return this.http.post<P2pAdsPayment>(`${this.apiUrl}${this.apiPrefix}`, createDto);
  }

  /**
   * GET /p2p-ads-payments/{id}
   * Get ads payment by ID
   */
  getAdsPaymentById(id: string | number): Observable<P2pAdsPayment> {
    return this.http.get<P2pAdsPayment>(`${this.apiUrl}${this.apiPrefix}/${id}`);
  }

  /**
   * PATCH /p2p-ads-payments/{id}
   * Update ads payment
   */
  updateAdsPayment(id: string | number, updateDto: UpdateP2pAdsPaymentDto): Observable<P2pAdsPayment> {
    return this.http.patch<P2pAdsPayment>(`${this.apiUrl}${this.apiPrefix}/${id}`, updateDto);
  }

  /**
   * DELETE /p2p-ads-payments/{id}
   * Delete ads payment
   */
  deleteAdsPayment(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.apiPrefix}/${id}`);
  }
}
