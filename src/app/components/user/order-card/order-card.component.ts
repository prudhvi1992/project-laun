import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-4 rounded-lg shadow mb-4" [class.opacity-90]="order.status === 'completed'">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="font-semibold">Order #{{ order.orderId }}</h3>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              {{ order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                 order.status === 'washing' ? 'bg-blue-100 text-blue-800' :
                 order.status === 'ready' ? 'bg-green-100 text-green-800' :
                 'bg-gray-100 text-gray-800'
              }}">
              {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
            </span>
          </div>
          <p class="text-gray-600">
            {{ order.status === 'completed' ? 'Completed on: ' : 'Order Date: ' }}
            {{ (order.status === 'completed' ? order.updatedAt : order.createdAt) | date:'short' }}
          </p>
        </div>
        <div>
          <p class="text-xl font-bold" [class.text-gray-600]="order.status === 'completed'">
            Total: {{ order.totalPrice.toFixed(2) }}
          </p>
          @if (order.status === 'ready') {
            <button class="bg-green-500 text-white px-4 py-2 rounded mt-2">
              Ready for Pickup
            </button>
          }
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        @for (item of order.items; track item.id) {
          <div class="border rounded-lg overflow-hidden">
            <img [src]="item.imageUrl" [alt]="item.type" class="w-full h-48 object-cover">
            <div class="p-3">
              <h4 class="font-semibold">{{ item.type }}</h4>
              <div class="flex justify-between text-gray-600">
                <span>Quantity: {{ item.quantity }}</span>
                <span>{{ item.pricePerItem.toFixed(2) }}/item</span>
              </div>
              <p class="text-right font-semibold mt-1">
                Subtotal:   {{ (item.quantity * item.pricePerItem).toFixed(2) }}
              </p>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class OrderCardComponent {
  @Input({ required: true }) order!: Order;
}