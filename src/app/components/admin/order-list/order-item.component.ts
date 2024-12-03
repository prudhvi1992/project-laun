import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-semibold">Order #{{ order.id }}</h3>
          <p class="text-gray-600">{{ order.userName }}</p>
        </div>
        <div class="flex gap-2">
          @if (order.status === 'pending') {
            <button 
              (click)="onStartWash.emit(order.id)"
              class="bg-blue-500 text-white px-4 py-2 rounded">
              Begin Wash
            </button>
          }
          @if (order.status === 'washing') {
            <button 
              (click)="onCompleteWash.emit(order.id)"
              class="bg-green-500 text-white px-4 py-2 rounded">
              Complete Wash
            </button>
          }
        </div>
      </div>
      
      <div class="mt-4 grid grid-cols-4 gap-4">
        @for (item of order.items; track item.id) {
          <div class="border p-2 rounded">
            <img [src]="item.imageUrl" alt="Clothing item" class="w-full h-32 object-cover rounded">
            <p class="mt-2 text-sm">{{ item.type }} ({{ item.quantity }})</p>
          </div>
        }
      </div>
    </div>
  `
})
export class OrderItemComponent {
  @Input({ required: true }) order!: Order;
  @Output() onStartWash = new EventEmitter<string>();
  @Output() onCompleteWash = new EventEmitter<string>();
}