import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'cross-chain', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'cross-chain',
    loadChildren: () => import('./cross-chain/cross-chain.routes').then((m) => m.routes),
  },
  {
    path: 'p2p',
    loadChildren: () => import('./p2p/p2p.routes').then((m) => m.routes),
  },
  {
    path: 'chart',
    loadChildren: () => import('./chart/chart.routes').then((m) => m.routes),
  },
];
