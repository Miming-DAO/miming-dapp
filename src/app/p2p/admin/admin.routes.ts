import { Routes } from '@angular/router';
import { Admin } from "./admin"

export const routes: Routes = [{
  path: "",
  component: Admin,
  children: [
    { path: '', redirectTo: '/p2p/admin/users', pathMatch: 'full' },
    {
      path: "users",
      loadComponent: () => import('./users/users').then(m => m.Users)
    },
  ]
}];
