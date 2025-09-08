import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dapp',
    loadComponent: () => import('./dapp/dapp').then((m) => m.Dapp),
  },
  {
    path: '',
    redirectTo: 'dapp',
    pathMatch: 'full',
  },
];
