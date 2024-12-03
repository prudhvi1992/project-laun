import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { UserDashboardComponent } from './components/user/user-dashboard.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { PricingManagementComponent } from './components/admin/pricing/pricing-management.component';
import { authGuard } from './guards/auth.guard';
import { AdminHeaderComponent } from './components/admin/admin-header/admin-header.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminHeaderComponent,
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
        canActivate: [authGuard],
        data: { role: 'admin' }
      },
      {
        path: 'pricing',
        component: PricingManagementComponent,
        canActivate: [authGuard],
        data: { role: 'admin' }
      }
    ]
  },
  {
    path: 'user',
    component: UserDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'user' }
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];