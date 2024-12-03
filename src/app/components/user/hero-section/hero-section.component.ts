import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-blue-600 text-white">
      <div class="container mx-auto px-4 py-16 flex items-center">
        <div class="w-1/2">
          <h1 class="text-4xl font-bold mb-4">Professional Laundry Service</h1>
          <p class="text-xl mb-8">Experience the convenience of our premium laundry service. 
            We take care of your clothes with the utmost attention to detail.</p>
          
          <div class="bg-white p-4 rounded-lg shadow-lg max-w-md">
            <h3 class="text-gray-800 font-semibold mb-2">Find Nearest Location</h3>
            <div class="flex gap-2">
              <input 
                [(ngModel)]="zipCode"
                type="text" 
                placeholder="Enter ZIP Code" 
                class="flex-1 p-2 border rounded text-gray-800">
              <button 
                (click)="onSearch.emit(zipCode)"
                class="bg-blue-500 text-white px-4 py-2 rounded">
                Search
              </button>
            </div>
          </div>
        </div>
        <div class="w-1/2">
          <img src="assets/laundry-hero.jpg" alt="Laundry Service" class="rounded-lg shadow-xl">
        </div>
      </div>
    </div>
  `
})
export class HeroSectionComponent {
  zipCode = '';
  @Output() onSearch = new EventEmitter<string>();
}