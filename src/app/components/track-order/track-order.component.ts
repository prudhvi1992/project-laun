import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-center mb-6">Track Your Order</h2>
        
        @if (error) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>
        }

        @if (!order) {
          <form (ngSubmit)="trackOrder()" #trackForm="ngForm">
            <div class="mb-4">
              <label for="orderId" class="block text-gray-700 text-sm font-bold mb-2">Order ID</label>
              <input
                type="text"
                id="orderId"
                [(ngModel)]="orderId"
                name="orderId"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your order ID"
              >
            </div>

            <button
              type="submit"
              [disabled]="loading"
              class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {{ loading ? 'Tracking...' : 'Track Order' }}
            </button>
          </form>
        }

        @if (order) {
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="font-semibold">Order #{{ order.orderId }}</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                {{ order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                   order.status === 'washing' ? 'bg-blue-100 text-blue-800' :
                   order.status === 'ready' ? 'bg-green-100 text-green-800' :
                   'bg-gray-100 text-gray-800'
                }}">
                {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
              </span>
            </div>

            <div class="border-t pt-4">
              <p class="text-gray-600">Customer: {{ order.customerName }}</p>
              <p class="text-gray-600">Phone: {{ order.customerPhone }}</p>
              <p class="text-gray-600">Order Date: {{ order.createdAt | date:'medium' }}</p>
            </div>

            <div class="border-t pt-4">
              <h4 class="font-semibold mb-2">Items</h4>
              <div class="space-y-2">
                @for (item of order.items; track item.id) {
                  <div class="flex justify-between items-center">
                    <span>{{ item.type }} ({{ item.quantity }}x)</span>
                    <span class="font-semibold">${{ item.pricePerItem * item.quantity }}</span>
                  </div>
                }
              </div>
              <div class="border-t mt-2 pt-2 flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>${{ order.totalPrice }}</span>
              </div>
            </div>

            <button
              (click)="order = null"
              class="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 mt-4"
            >
              Track Another Order
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class TrackOrderComponent {
  orderId = '';
  order: Order | null = null;
  loading = false;
  error = '';

  constructor(private orderService: OrderService) {}

  trackOrder() {
    if (!this.orderId) {
      this.error = 'Please enter an order ID';
      return;
    }

    this.loading = true;
    this.error = '';

    this.orderService.trackOrder(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error.message || 'Order not found';
        this.loading = false;
      }
    });
  }
}