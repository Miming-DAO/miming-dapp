import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { P2pOrder, CreateP2pOrderDto, UpdateP2pOrderDto } from '../../models/p2p-order.model';

@Injectable({
  providedIn: 'root'
})
export class P2pOrdersService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = 'api/p2p-orders';

  constructor(
    private http: HttpClient
  ) { }

  private getHeaders(includeContentType = true): HttpHeaders {
    const googleUser = localStorage.getItem('auth_user');
    let headers = new HttpHeaders();

    if (includeContentType) {
      headers = headers.set('Content-Type', 'application/json');
    }

    if (googleUser) {
      const userData = JSON.parse(googleUser);
      if (userData.access_token) {
        headers = headers.set('Authorization', `Bearer ${userData.access_token}`);
      }
    }

    return headers;
  }

  getP2pOrders(): Observable<P2pOrder[]> {
    return this.http.get<P2pOrder[]>(`${this.apiUrl}/${this.apiPrefix}`, {
      headers: this.getHeaders()
    });
  }

  getP2pMyOrdersByAuthUser(): Observable<P2pOrder[]> {
    return this.http.get<P2pOrder[]>(`${this.apiUrl}/${this.apiPrefix}/by/my-orders/auth-user`, {
      headers: this.getHeaders()
    });
  }

  getP2pAdOrdersByAuthUser(): Observable<P2pOrder[]> {
    return this.http.get<P2pOrder[]>(`${this.apiUrl}/${this.apiPrefix}/by/ad-orders/auth-user`, {
      headers: this.getHeaders()
    });
  }

  getP2pOrdersByP2pAd(p2p_ad_id: string): Observable<P2pOrder[]> {
    return this.http.get<P2pOrder[]>(`${this.apiUrl}/${this.apiPrefix}/by/p2p-ad/${p2p_ad_id}`, {
      headers: this.getHeaders()
    });
  }

  createP2pOrder(createDto: CreateP2pOrderDto): Observable<P2pOrder> {
    return this.http.post<P2pOrder>(`${this.apiUrl}/${this.apiPrefix}`, createDto, {
      headers: this.getHeaders()
    });
  }

  getP2pOrderById(id: string): Observable<P2pOrder> {
    return this.http.get<P2pOrder>(`${this.apiUrl}/${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }

  uploadProofAttachment(id: string, files: File[]): Observable<P2pOrder> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.http.post<P2pOrder>(
      `${this.apiUrl}/${this.apiPrefix}/upload-proof-attachment/${id}`,
      formData,
      { headers: this.getHeaders(false) }
    );
  }

  confirmP2pOrder(id: string): Observable<P2pOrder> {
    return this.http.patch<P2pOrder>(
      `${this.apiUrl}/${this.apiPrefix}/confirm/${id}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  cancelP2pOrder(id: string): Observable<P2pOrder> {
    return this.http.patch<P2pOrder>(
      `${this.apiUrl}/${this.apiPrefix}/cancel/${id}`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
