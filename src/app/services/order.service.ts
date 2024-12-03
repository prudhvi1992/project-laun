import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(this.API_URL, orderData);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/all`);
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/user`);
  }

  trackOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/track/${orderId}`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.API_URL}/${orderId}/status`, { status });
  }
}