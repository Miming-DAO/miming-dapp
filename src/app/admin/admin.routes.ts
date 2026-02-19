import { Routes } from '@angular/router';
import { Admin } from './admin';

export const routes: Routes = [
  {
    path: "",
    component: Admin,
    children: [
      { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
      {
        path: "dashboard",
        loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: "users",
        loadComponent: () => import('./users/users').then(m => m.Users)
      },
    ]
  },
];
