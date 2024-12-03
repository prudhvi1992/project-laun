import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onFiltersChange()"
            placeholder="Order ID or Phone"
            class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            [(ngModel)]="selectedStatus"
            (ngModelChange)="onFiltersChange()"
            class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="washing">Washing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <!-- Sort By -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            [(ngModel)]="sortBy"
            (ngModelChange)="onFiltersChange()"
            class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="status">Status</option>
          </select>
        </div>

        <!-- Reset Button -->
        <div class="flex items-end">
          <button
            (click)="resetFilters()"
            class="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  `
})
export class OrderFiltersComponent {
  @Input() searchTerm = '';
  @Input() selectedStatus = '';
  @Input() sortBy = 'date-desc';
  
  @Output() filtersChanged = new EventEmitter<{
    searchTerm: string;
    status: string;
    sortBy: string;
  }>();

  onFiltersChange() {
    this.filtersChanged.emit({
      searchTerm: this.searchTerm,
      status: this.selectedStatus,
      sortBy: this.sortBy
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.sortBy = 'date-desc';
    this.onFiltersChange();
  }
}