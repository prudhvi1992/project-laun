import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data['role'];
  if (requiredRole === 'admin' && !authService.isAdmin()) {
    router.navigate(['/user']);
    return false;
  }

  if (requiredRole === 'user' && !authService.isUser()) {
    router.navigate(['/admin']);
    return false;
  }

  return true;
};