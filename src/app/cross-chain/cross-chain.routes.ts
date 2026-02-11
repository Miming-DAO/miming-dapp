import { Routes } from '@angular/router';
import { CrossChain } from "./cross-chain"

export const routes: Routes = [{
  path: "",
  component: CrossChain,
  children: [
    { path: '', redirectTo: '/cross-chain/teleport', pathMatch: 'full' },
    {
      path: "teleport",
      loadComponent: () => import('./teleport/teleport').then(m => m.Teleport)
    },
    {
      path: "xterium-accounts",
      loadComponent: () => import('./xterium-accounts/xterium-accounts').then(m => m.XteriumAccounts)
    },
    {
      path: "sign-transaction",
      loadComponent: () => import('./sign-transaction/sign-transaction').then(m => m.SignTransaction)
    },
  ]
}];
