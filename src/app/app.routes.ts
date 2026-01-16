import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dapp', pathMatch: 'full' },
  {
    path: 'dapp',
    loadChildren: () =>
      import('./dapp/dapp.routes').then((m) => m.routes),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.routes),
  }
];
