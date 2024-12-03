import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-center mb-6">Register</h2>
        
        @if (error) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="mb-4">
            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="name"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your name"
            >
          </div>

          <div class="mb-4">
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
            >
          </div>

          <div class="mb-4">
            <label for="mobile" class="block text-gray-700 text-sm font-bold mb-2">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              [(ngModel)]="mobile"
              required
              pattern="[0-9]{10}"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your 10-digit mobile number"
            >
          </div>

          <div class="mb-6">
            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
            >
          </div>

          <button
            type="submit"
            [disabled]="loading"
            class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>

        <p class="mt-4 text-center text-gray-600">
          Already have an account?
          <a routerLink="/login" class="text-blue-500 hover:text-blue-600">Login here</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  mobile = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.name || !this.email || !this.password || !this.mobile) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (!/^[0-9]{10}$/.test(this.mobile)) {
      this.error = 'Please enter a valid 10-digit mobile number';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.email, this.password, this.name, this.mobile).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.error = error.error.message || 'An error occurred during registration';
        this.loading = false;
      }
    });
  }
}