import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LaundryItem } from '../../../models/laundery-item.model';
import { LaundryService } from '../../../services/laundry.service';

@Component({
  selector: 'app-pricing-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Pricing Management</h2>
          <button
            (click)="showAddForm = true"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Add New Item
          </button>
        </div>

        @if (error) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>
        }

        @if (showAddForm) {
          <div class="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Add New Item</h3>
            <form (ngSubmit)="addItem()" #addForm="ngForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  [(ngModel)]="newItem.name"
                  name="name"
                  required
                  class="w-full px-3 py-2 border rounded-lg"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  [(ngModel)]="newItem.category"
                  name="category"
                  required
                  class="w-full px-3 py-2 border rounded-lg"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Base Price ($)</label>
                <input
                  type="number"
                  [(ngModel)]="newItem.basePrice"
                  name="basePrice"
                  required
                  min="0"
                  step="0.01"
                  class="w-full px-3 py-2 border rounded-lg"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
                <input
                  type="text"
                  [(ngModel)]="newItem.estimatedTime"
                  name="estimatedTime"
                  placeholder="e.g., 24 hours"
                  class="w-full px-3 py-2 border rounded-lg"
                >
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  [(ngModel)]="newItem.description"
                  name="description"
                  rows="2"
                  class="w-full px-3 py-2 border rounded-lg"
                ></textarea>
              </div>
              <div class="md:col-span-2 flex justify-end space-x-2">
                <button
                  type="button"
                  (click)="showAddForm = false"
                  class="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="!addForm.form.valid || loading"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        }

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (item of items; track item._id) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.category }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.basePrice.toFixed(2) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class.bg-green-100]="item.active"
                      [class.text-green-800]="item.active"
                      [class.bg-red-100]="!item.active"
                      [class.text-red-800]="!item.active">
                      {{ item.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      (click)="toggleItemStatus(item)"
                      class="text-sm text-blue-600 hover:text-blue-900 mr-2">
                      {{ item.active ? 'Deactivate' : 'Activate' }}
                    </button>
                    <button
                      (click)="editItem(item)"
                      class="text-sm text-green-600 hover:text-green-900">
                      Edit
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PricingManagementComponent implements OnInit {
  items: LaundryItem[] = [];
  showAddForm = false;
  loading = false;
  error = '';
  
  newItem: LaundryItem = {
    name: '',
    category: '',
    basePrice: 0,
    description: '',
    estimatedTime: '',
    active: true
  };

  constructor(private laundryService: LaundryService) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.laundryService.getLaundryItems().subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error.message || 'Failed to load items';
        this.loading = false;
      }
    });
  }

  addItem() {
    this.loading = true;
    this.error = '';

    this.laundryService.addLaundryItem(this.newItem).subscribe({
      next: (item) => {
        this.items.push(item);
        this.showAddForm = false;
        this.resetNewItem();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error.message || 'Failed to add item';
        this.loading = false;
      }
    });
  }

  toggleItemStatus(item: LaundryItem) {
    this.laundryService.updateLaundryItem(item._id!, { ...item, active: !item.active }).subscribe({
      next: (updatedItem) => {
        const index = this.items.findIndex(i => i._id === updatedItem._id);
        if (index !== -1) {
          this.items[index] = updatedItem;
        }
      },
      error: (error) => {
        this.error = error.error.message || 'Failed to update item';
      }
    });
  }

  editItem(item: LaundryItem) {
    // Implement edit functionality
    console.log('Edit item:', item);
  }

  private resetNewItem() {
    this.newItem = {
      name: '',
      category: '',
      basePrice: 0,
      description: '',
      estimatedTime: '',
      active: true
    };
  }
}