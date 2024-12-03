import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { OrderCardComponent } from './order-card/order-card.component';
import { OrderService } from '../../services/order.service';
import { LaundryService } from '../../services/laundry.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, HeroSectionComponent, OrderCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-hero-section (onSearch)="findService($event)" />

      <div class="container mx-auto px-4 py-8">
        @if (loading) {
          <div class="text-center py-4">
            <p>Loading orders...</p>
          </div>
        }

        @if (error) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>
        }

        <h2 class="text-2xl font-bold mb-6">Current Orders</h2>
        @if (currentOrders.length === 0 && !loading) {
          <p class="text-gray-600 text-center py-4">No current orders</p>
        }
        @for (order of currentOrders; track order._id) {
          <app-order-card [order]="order" />
        }

        <h2 class="text-2xl font-bold mb-6 mt-12">Previous Orders</h2>
        @if (previousOrders.length === 0 && !loading) {
          <p class="text-gray-600 text-center py-4">No previous orders</p>
        }
        @for (order of previousOrders; track order._id) {
          <app-order-card [order]="order" />
        }
      </div>
    </div>
  `
})
export class UserDashboardComponent implements OnInit {
  currentOrders: Order[] = [];
  previousOrders: Order[] = [];
  loading = true;
  error = '';

  constructor(
    private orderService: OrderService,
    private laundryService: LaundryService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.error = '';

    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.currentOrders = orders.filter(order => 
          ['pending', 'washing', 'ready'].includes(order.status)
        );
        this.previousOrders = orders.filter(order => 
          order.status === 'completed'
        );
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error.message || 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  findService(zipCode: string) {
    if (zipCode) {
      this.laundryService.findLaundryByZipCode(zipCode).subscribe({
        next: (service) => {
          // Handle the found service (e.g., show in a modal or update UI)
          console.log('Found service:', service);
        },
        error: (error) => {
          console.error('Error finding service:', error);
        }
      });
    }
  }
}