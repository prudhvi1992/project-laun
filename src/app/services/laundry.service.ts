import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LaundryItem } from '../models/laundery-item.model';

@Injectable({
  providedIn: 'root'
})
export class LaundryService {
  private readonly API_URL = `${environment.apiUrl}/laundry`;

  constructor(private http: HttpClient) {}

  getLaundryItems(): Observable<LaundryItem[]> {
    return this.http.get<LaundryItem[]>(`${this.API_URL}/items`);
  }

  addLaundryItem(item: LaundryItem): Observable<LaundryItem> {
    return this.http.post<LaundryItem>(`${this.API_URL}/items`, item);
  }

  updateLaundryItem(id: string, item: LaundryItem): Observable<LaundryItem> {
    return this.http.put<LaundryItem>(`${this.API_URL}/items/${id}`, item);
  }

  findLaundryByZipCode(zipCode: string) {
    return this.http.get<any>(`${this.API_URL}/locations/${zipCode}`);
  }
}