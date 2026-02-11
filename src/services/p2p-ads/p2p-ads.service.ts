import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { P2pAd, CreateP2pAdDto, UpdateP2pAdDto } from '../../models/p2p-ad.model';

@Injectable({
  providedIn: 'root'
})
export class P2pAdsService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = 'api/p2p-ads';

  constructor(
    private http: HttpClient
  ) { }

  private getHeaders(): HttpHeaders {
    const googleUser = localStorage.getItem('google_user');
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

  getAds(): Observable<P2pAd[]> {
    return this.http.get<P2pAd[]>(`${this.apiUrl}/${this.apiPrefix}`, {
      headers: this.getHeaders()
    });
  }

  getAdsByAuthUser(): Observable<P2pAd[]> {
    return this.http.get<P2pAd[]>(`${this.apiUrl}/${this.apiPrefix}/by/auth-user`, {
      headers: this.getHeaders()
    });
  }

  createAd(createDto: CreateP2pAdDto): Observable<P2pAd> {
    return this.http.post<P2pAd>(`${this.apiUrl}/${this.apiPrefix}`, createDto, {
      headers: this.getHeaders()
    });
  }

  getAdById(id: string): Observable<P2pAd> {
    return this.http.get<P2pAd>(`${this.apiUrl}/${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateAd(id: string, updateDto: UpdateP2pAdDto): Observable<P2pAd> {
    return this.http.patch<P2pAd>(`${this.apiUrl}/${this.apiPrefix}/${id}`, updateDto, {
      headers: this.getHeaders()
    });
  }

  deleteAd(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
