import { Routes } from '@angular/router';
import { P2p } from './p2p';

export const routes: Routes = [
  {
    path: "",
    component: P2p,
    children: [
      { path: '', redirectTo: '/p2p/marketplace', pathMatch: 'full' },
      {
        path: "marketplace",
        loadComponent: () => import('./marketplace/marketplace').then(m => m.Marketplace)
      },
      {
        path: "orders",
        loadComponent: () => import('./orders/orders').then(m => m.Orders)
      },
      {
        path: "order-details/:id",
        loadComponent: () => import('./order-details/order-details').then(m => m.OrderDetails)
      },
      {
        path: "my-ads",
        loadComponent: () => import('./my-ads/my-ads').then(m => m.MyAds)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then((m) => m.routes),
      },
    ]
  },
];
