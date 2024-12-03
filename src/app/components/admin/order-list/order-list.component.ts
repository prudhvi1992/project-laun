import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderItemComponent } from './order-item.component';
import { LaundryService } from '../../../services/laundry.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, OrderItemComponent],
  template: `
    <div class="grid gap-4">
      @for (order of orders$ | async; track order.id) {
        <app-order-item
          [order]="order"
          (onStartWash)="startWash($event)"
          (onCompleteWash)="completeWash($event)"
        />
      }
    </div>
  `
})
export class OrderListComponent {
  orders$ = this.laundryService.orders$;

  constructor(private laundryService: LaundryService) {}

  startWash(orderId: string) {
    this.laundryService.updateOrderStatus(orderId, 'washing');
  }

  completeWash(orderId: string) {
    this.laundryService.updateOrderStatus(orderId, 'completed');
  }
}