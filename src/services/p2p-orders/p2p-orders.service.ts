import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { P2pOrder, CreateP2pOrderDto, UpdateP2pOrderDto } from '../../models/p2p-order.model';

@Injectable({
  providedIn: 'root'
})
export class P2pOrdersService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private apiPrefix = '/p2p-orders';

  /**
   * GET /p2p-orders
   * Get all orders
   */
  getOrders(): Observable<P2pOrder[]> {
    return this.http.get<P2pOrder[]>(`${this.apiUrl}${this.apiPrefix}`);
  }

  /**
   * POST /p2p-orders
   * Create a new order
   */
  createOrder(createDto: CreateP2pOrderDto): Observable<P2pOrder> {
    return this.http.post<P2pOrder>(`${this.apiUrl}${this.apiPrefix}`, createDto);
  }

  /**
   * GET /p2p-orders/{id}
   * Get order by ID
   */
  getOrderById(id: string | number): Observable<P2pOrder> {
    return this.http.get<P2pOrder>(`${this.apiUrl}${this.apiPrefix}/${id}`);
  }

  /**
   * PATCH /p2p-orders/{id}
   * Update order
   */
  updateOrder(id: string | number, updateDto: UpdateP2pOrderDto): Observable<P2pOrder> {
    return this.http.patch<P2pOrder>(`${this.apiUrl}${this.apiPrefix}/${id}`, updateDto);
  }

  /**
   * DELETE /p2p-orders/{id}
   * Delete order
   */
  deleteOrder(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.apiPrefix}/${id}`);
  }
}
