import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  generateInvoiceNumber(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `INV-${timestamp}-${random}`;
  }

  calculateSubtotal(items: any[]): number {
    return items.reduce((total, item) => total + (item.quantity * item.pricePerItem), 0);
  }

  calculateTax(subtotal: number): number {
    return subtotal * 0.1; // 10% tax
  }

  calculateTotal(subtotal: number, tax: number): number {
    return subtotal + tax;
  }

  generateInvoiceData(order: Order) {
    const invoiceNumber = this.generateInvoiceNumber();
    const subtotal = this.calculateSubtotal(order.items);
    const tax = this.calculateTax(subtotal);
    const total = this.calculateTotal(subtotal, tax);

    return {
      invoiceNumber,
      date: new Date(),
      order,
      subtotal,
      tax,
      total
    };
  }
}