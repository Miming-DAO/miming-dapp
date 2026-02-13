import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { P2pPaymentType, CreateP2pPaymentTypeDto, UpdateP2pPaymentTypeDto } from '../../models/p2p-payment-type.model';

@Injectable({
  providedIn: 'root'
})
export class P2pPaymentTypesService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = 'api/p2p-payment-types';

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

  getP2pPaymentTypes(): Observable<P2pPaymentType[]> {
    return this.http.get<P2pPaymentType[]>(`${this.apiUrl}/${this.apiPrefix}`, {
      headers: this.getHeaders()
    });
  }

  createP2pPaymentType(createDto: CreateP2pPaymentTypeDto): Observable<P2pPaymentType> {
    return this.http.post<P2pPaymentType>(`${this.apiUrl}/${this.apiPrefix}`, createDto, {
      headers: this.getHeaders()
    });
  }

  getP2pPaymentTypeById(id: string | number): Observable<P2pPaymentType> {
    return this.http.get<P2pPaymentType>(`${this.apiUrl}/${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateP2pPaymentType(id: string | number, updateDto: UpdateP2pPaymentTypeDto): Observable<P2pPaymentType> {
    return this.http.patch<P2pPaymentType>(`${this.apiUrl}/${this.apiPrefix}/${id}`, updateDto, {
      headers: this.getHeaders()
    });
  }

  deleteP2pPaymentType(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
