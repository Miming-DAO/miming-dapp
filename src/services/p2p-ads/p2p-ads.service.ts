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

  getP2pAds(): Observable<P2pAd[]> {
    return this.http.get<P2pAd[]>(`${this.apiUrl}/${this.apiPrefix}`, {
      headers: this.getHeaders()
    });
  }

  getP2pAdsByAuthUser(): Observable<P2pAd[]> {
    return this.http.get<P2pAd[]>(`${this.apiUrl}/${this.apiPrefix}/by/auth-user`, {
      headers: this.getHeaders()
    });
  }

  createP2pAd(createDto: CreateP2pAdDto): Observable<P2pAd> {
    return this.http.post<P2pAd>(`${this.apiUrl}/${this.apiPrefix}`, createDto, {
      headers: this.getHeaders()
    });
  }

  getP2pAdById(id: string): Observable<P2pAd> {
    return this.http.get<P2pAd>(`${this.apiUrl}/${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateP2pAd(id: string, updateDto: UpdateP2pAdDto): Observable<P2pAd> {
    return this.http.patch<P2pAd>(`${this.apiUrl}/${this.apiPrefix}/${id}`, updateDto, {
      headers: this.getHeaders()
    });
  }

  uploadLogo(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(
      `${this.apiUrl}/${this.apiPrefix}/upload-logo`,
      formData,
      { headers: this.getHeaders(false) }
    );
  }

  deleteP2pAd(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.apiPrefix}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
