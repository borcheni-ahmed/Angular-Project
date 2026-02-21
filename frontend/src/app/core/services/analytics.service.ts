import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/Analytics`;

  constructor(private http: HttpClient) {}

  getSalesTrend(months: number = 12) {
    return this.http.get<any[]>(`${this.apiUrl}/sales/trend?months=${months}`);
  }


  getSalesByCountry() {
    return this.http.get<any[]>(`${this.apiUrl}/sales/country`);
  }


  getSalesByProduct(top: number = 5) {
    return this.http.get<any[]>(`${this.apiUrl}/sales/product?top=${top}`); // ← was by-product, topN → top
  }


  getKPIs() {
    return this.http.get<any>(`${this.apiUrl}/kpis`);
  }
}
