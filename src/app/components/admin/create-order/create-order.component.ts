import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6">Create New Order</h2>

      @if (error) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>
      }

      @if (success) {
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Order created successfully! Order ID: {{ success }}
        </div>
      }

      <form (ngSubmit)="onSubmit()" #orderForm="ngForm">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Customer Name</label>
            <input
              type="text"
              [(ngModel)]="orderData.customerName"
              name="customerName"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
            <input
              type="tel"
              [(ngModel)]="orderData.customerPhone"
              name="customerPhone"
              required
              pattern="[0-9]{10}"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
          </div>
        </div>

        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2">Items</h3>
          @for (item of orderData.items; track $index) {
            <div class="flex gap-4 mb-2">
              <div class="flex-1">
                <input
                  type="text"
                  [(ngModel)]="item.type"
                  [name]="'itemType' + $index"
                  placeholder="Item type"
                  class="w-full px-3 py-2 border rounded-lg"
                >
              </div>
              <div class="w-32">
                <input
                  type="number"
                  [(ngModel)]="item.quantity"
                  [name]="'itemQuantity' + $index"
                  placeholder="Qty"
                  min="1"
                  class="w-full px-3 py-2 border rounded-lg"
                >
              </div>
              <div class="w-32">
                <input
                  type="number"
                  [(ngModel)]="item.pricePerItem"
                  [name]="'itemPrice' + $index"
                  placeholder="Price"
                  min="0"
                  class="w-full px-3 py-2 border rounded-lg"
                >
              </div>
              <button
                type="button"
                (click)="removeItem($index)"
                class="px-3 py-2 bg-red-500 text-white rounded-lg"
              >
                Remove
              </button>
            </div>
          }
          <button
            type="button"
            (click)="addItem()"
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Add Item
          </button>
        </div>

        <div class="text-right">
          <button
            type="submit"
            [disabled]="loading"
            class="px-6 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Order' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class CreateOrderComponent {
  orderData = {
    customerName: '',
    customerPhone: '',
    items: [{ type: '', quantity: 1, pricePerItem: 0, imageUrl: 'default-image-url' }]
  };

  loading = false;
  error = '';
  success = '';

  constructor(private orderService: OrderService) {}

  addItem() {
    this.orderData.items.push({ type: '', quantity: 1, pricePerItem: 0, imageUrl: 'default-image-url' });
  }

  removeItem(index: number) {
    this.orderData.items.splice(index, 1);
  }

  onSubmit() {
    if (!this.orderData.customerName || !this.orderData.customerPhone) {
      this.error = 'Please fill in all required fields';
      return;
    }

    if (!/^[0-9]{10}$/.test(this.orderData.customerPhone)) {
      this.error = 'Please enter a valid 10-digit phone number';
      return;
    }

    if (this.orderData.items.some(item => !item.type || item.quantity < 1 || item.pricePerItem < 0)) {
      this.error = 'Please fill in all item details correctly';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.orderService.createOrder(this.orderData).subscribe({
      next: (response) => {
        this.success = response.orderId;
        this.loading = false;
        this.resetForm();
      },
      error: (error) => {
        this.error = error.error.message || 'Failed to create order';
        this.loading = false;
      }
    });
  }

  private resetForm() {
    this.orderData = {
      customerName: '',
      customerPhone: '',
      items: [{ type: '', quantity: 1, pricePerItem: 0, imageUrl: 'default-image-url' }]
    };
  }
}