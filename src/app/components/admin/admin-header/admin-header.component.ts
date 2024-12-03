import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="bg-white shadow">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <nav class="flex space-x-4">
              <a 
                routerLink="/admin" 
                routerLinkActive="text-blue-600"
                [routerLinkActiveOptions]="{exact: true}"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                Orders
              </a>
              <a 
                routerLink="/admin/pricing" 
                routerLinkActive="text-blue-600"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                Pricing
              </a>
            </nav>
          </div>
          <button 
            (click)="logout()"
            class="text-gray-700 hover:text-red-600 px-3 py-2">
            Logout
          </button>
        </div>
      </div>
    </header>
    <router-outlet></router-outlet>
  `
})
export class AdminHeaderComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}