import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/Customers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(customer: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, customer);
  }

  update(id: number, customer: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, customer);
  }

  getAllWithOrderCount(): Observable<any[]> {
    return this.getAll().pipe(
      switchMap(customers =>
        forkJoin(
          customers.map(c =>
            this.getById(c.customerID).pipe(
              map(detail => ({ ...c, totalOrders: detail.totalOrders ?? 0 }))
            )
          )
        )
      )
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
