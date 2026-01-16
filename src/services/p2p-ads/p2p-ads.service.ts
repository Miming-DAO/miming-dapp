import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { P2pAd, CreateP2pAdDto, UpdateP2pAdDto } from '../../models/p2p-ad.model';

@Injectable({
  providedIn: 'root'
})
export class P2pAdsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private apiPrefix = '/p2p-ads';

  /**
   * GET /p2p-ads
   * Get all ads
   */
  getAds(): Observable<P2pAd[]> {
    return this.http.get<P2pAd[]>(`${this.apiUrl}${this.apiPrefix}`);
  }

  /**
   * POST /p2p-ads
   * Create a new ad
   */
  createAd(createDto: CreateP2pAdDto): Observable<P2pAd> {
    return this.http.post<P2pAd>(`${this.apiUrl}${this.apiPrefix}`, createDto);
  }

  /**
   * GET /p2p-ads/{id}
   * Get ad by ID
   */
  getAdById(id: string | number): Observable<P2pAd> {
    return this.http.get<P2pAd>(`${this.apiUrl}${this.apiPrefix}/${id}`);
  }

  /**
   * PATCH /p2p-ads/{id}
   * Update ad
   */
  updateAd(id: string | number, updateDto: UpdateP2pAdDto): Observable<P2pAd> {
    return this.http.patch<P2pAd>(`${this.apiUrl}${this.apiPrefix}/${id}`, updateDto);
  }

  /**
   * DELETE /p2p-ads/{id}
   * Delete ad
   */
  deleteAd(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.apiPrefix}/${id}`);
  }
}
