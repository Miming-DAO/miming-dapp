import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { P2pPaymentType, CreateP2pPaymentTypeDto, UpdateP2pPaymentTypeDto } from '../../models/p2p-payment-type.model';

@Injectable({
  providedIn: 'root'
})
export class P2pPaymentTypesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private apiPrefix = '/p2p-payment-types';

  /**
   * GET /p2p-payment-types
   * Get all payment types
   */
  getPaymentTypes(): Observable<P2pPaymentType[]> {
    return this.http.get<P2pPaymentType[]>(`${this.apiUrl}${this.apiPrefix}`);
  }

  /**
   * POST /p2p-payment-types
   * Create a new payment type
   */
  createPaymentType(createDto: CreateP2pPaymentTypeDto): Observable<P2pPaymentType> {
    return this.http.post<P2pPaymentType>(`${this.apiUrl}${this.apiPrefix}`, createDto);
  }

  /**
   * GET /p2p-payment-types/{id}
   * Get payment type by ID
   */
  getPaymentTypeById(id: string | number): Observable<P2pPaymentType> {
    return this.http.get<P2pPaymentType>(`${this.apiUrl}${this.apiPrefix}/${id}`);
  }

  /**
   * PATCH /p2p-payment-types/{id}
   * Update payment type
   */
  updatePaymentType(id: string | number, updateDto: UpdateP2pPaymentTypeDto): Observable<P2pPaymentType> {
    return this.http.patch<P2pPaymentType>(`${this.apiUrl}${this.apiPrefix}/${id}`, updateDto);
  }

  /**
   * DELETE /p2p-payment-types/{id}
   * Delete payment type
   */
  deletePaymentType(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.apiPrefix}/${id}`);
  }
}
