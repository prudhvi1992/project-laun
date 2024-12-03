import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../models/order.model';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 p-8">
        <div class="flex justify-between items-start mb-8">
          <div>
            <h2 class="text-2xl font-bold">INVOICE</h2>
            <p class="text-gray-600">Invoice #: {{ invoiceData.invoiceNumber }}</p>
            <p class="text-gray-600">Date: {{ invoiceData.date | date:'mediumDate' }}</p>
          </div>
          <button 
            (click)="onClose.emit()"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-8">
          <h3 class="font-semibold mb-2">Customer Details</h3>
          <p>{{ order.customerName }}</p>
          <p>{{ order.customerPhone }}</p>
        </div>

        <table class="w-full mb-8">
          <thead>
            <tr class="border-b">
              <th class="text-left py-2">Item</th>
              <th class="text-center py-2">Quantity</th>
              <th class="text-right py-2">Price</th>
              <th class="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            @for (item of order.items; track item.id) {
              <tr class="border-b">
                <td class="py-2">{{ item.type }}</td>
                <td class="text-center py-2">{{ item.quantity }}</td>
                <td class="text-right py-2">{{ item.pricePerItem.toFixed(2) }}</td>
                <td class="text-right py-2">{{ (item.quantity * item.pricePerItem).toFixed(2) }}</td>
              </tr>
            }
          </tbody>
        </table>

        <div class="flex justify-end">
          <div class="w-64">
            <div class="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{{ invoiceData.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span>Tax (10%):</span>
              <span>{{ invoiceData.tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between font-bold border-t pt-2">
              <span>Total:</span>
              <span>{{ invoiceData.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-end gap-4">
          <button
            (click)="printInvoice()"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Print Invoice
          </button>
          <button
            (click)="onClose.emit()"
            class="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `
})
export class InvoiceComponent {
  @Input({ required: true }) order!: Order;
  @Output() onClose = new EventEmitter<void>();

  invoiceData: any;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.invoiceData = this.invoiceService.generateInvoiceData(this.order);
  }

  printInvoice() {
    window.print();
  }
}