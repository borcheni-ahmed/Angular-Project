import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) {}

  // get orders by customerID
  getByCustomer(customerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  // user places their own order
  create(order: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, order);
  }

  // update existing order (admin)
  update(id: number, order: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, order);
  }

  // user cancels their own order
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
