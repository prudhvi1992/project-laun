import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { CreateOrderComponent } from './create-order/create-order.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { OrderFiltersComponent } from './orders/order-filter.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CreateOrderComponent, InvoiceComponent, OrderFiltersComponent],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <app-create-order class="mb-8" />

      <div class="space-y-6">
        <h2 class="text-xl font-semibold">All Orders</h2>
        
        <app-order-filters
          [searchTerm]="searchTerm"
          [selectedStatus]="selectedStatus"
          [sortBy]="sortBy"
          (filtersChanged)="onFiltersChanged($event)"
        />

        @if (loading) {
          <div class="text-center py-4">
            <p>Loading orders...</p>
          </div>
        }

        @if (error) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>
        }

        @if (filteredOrders.length === 0 && !loading) {
          <div class="text-center py-4 text-gray-600">
            No orders found
          </div>
        }

        @for (order of filteredOrders; track order.orderId) {
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="font-semibold text-lg">Order #{{ order.orderId }}</h3>
                <p class="text-gray-600">{{ order.customerName }} | {{ order.customerPhone }}</p>
                <p class="text-gray-600">Created: {{ order.createdAt | date:'medium' }}</p>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2
                  {{ order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                     order.status === 'washing' ? 'bg-blue-100 text-blue-800' :
                     order.status === 'ready' ? 'bg-green-100 text-green-800' :
                     'bg-gray-100 text-gray-800'
                  }}">
                  {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
                </span>
                <p class="font-bold text-lg">Total: {{ order.totalPrice.toFixed(2) }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              @for (item of order.items; track item.id) {
                <div class="border rounded-lg overflow-hidden">
                  <img [src]="item.imageUrl" [alt]="item.type" class="w-full h-48 object-cover">
                  <div class="p-3">
                    <h4 class="font-semibold">{{ item.type }}</h4>
                    <div class="flex justify-between text-gray-600">
                      <span>Quantity: {{ item.quantity }}</span>
                      <span>{{ item.pricePerItem.toFixed(2) }}/item</span>
                    </div>
                  </div>
                </div>
              }
            </div>

            <div class="flex justify-end gap-2">
              @if (order.status === 'pending') {
                <button
                  (click)="updateOrderStatus(order._id, 'washing')"
                  class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Begin Wash
                </button>
              }
              @if (order.status === 'washing') {
                <button
                  (click)="updateOrderStatus(order._id, 'ready')"
                  class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Mark as Ready
                </button>
              }
              @if (order.status === 'ready') {
                <button
                  (click)="generateInvoice(order)"
                  class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                >
                  Generate Invoice
                </button>
                <button
                  (click)="updateOrderStatus(order._id, 'completed')"
                  class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Complete Order
                </button>
              }
            </div>
          </div>
        }
      </div>

      @if (selectedOrder) {
        <app-invoice 
          [order]="selectedOrder" 
          (onClose)="selectedOrder = null" 
        />
      }
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = true;
  error = '';
  selectedOrder: Order | null = null;

  // Filter states
  searchTerm = '';
  selectedStatus = '';
  sortBy = 'date-desc';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.error = '';

    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error.message || 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  onFiltersChanged(filters: { searchTerm: string; status: string; sortBy: string }) {
    this.searchTerm = filters.searchTerm;
    this.selectedStatus = filters.status;
    this.sortBy = filters.sortBy;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.orders];

    // Apply search
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderId.toLowerCase().includes(searchLower) ||
        order.customerPhone.includes(searchLower)
      );
    }

    // Apply status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'status':
          const statusOrder = { pending: 1, washing: 2, ready: 3, completed: 4 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    this.filteredOrders = filtered;
  }

  updateOrderStatus(orderId: string, status: string) {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: (updatedOrder) => {
        this.orders = this.orders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        );
        this.applyFilters();
      },
      error: (error) => {
        console.error('Failed to update order status:', error);
      }
    });
  }

  generateInvoice(order: Order) {
    this.selectedOrder = order;
  }
}