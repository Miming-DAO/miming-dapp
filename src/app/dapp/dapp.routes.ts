import { Routes } from '@angular/router';
import { Dapp } from "./dapp"

export const routes: Routes = [{
  path: "",
  component: Dapp,
  children: [
    { path: '', redirectTo: '/dapp/cross-chain', pathMatch: 'full' },
    {
      path: "home",
      loadComponent: () => import('./home/home').then(m => m.Home)
    },
    {
      path: "cross-chain",
      loadComponent: () => import('./cross-chain/cross-chain').then(m => m.CrossChain)
    },
    {
      path: "cross-chain-xterium-accounts",
      loadComponent: () => import('./cross-chain/cross-chain-xterium-accounts/cross-chain-xterium-accounts').then(m => m.CrossChainXteriumAccounts)
    },
    {
      path: "cross-chain-sign-transaction",
      loadComponent: () => import('./cross-chain/cross-chain-sign-transaction/cross-chain-sign-transaction').then(m => m.CrossChainSignTransaction)
    },
    {
      path: "p2p",
      loadComponent: () => import('./p2p/p2p').then(m => m.P2p)
    },
    {
      path: "p2p-admin",
      loadComponent: () => import('./p2p-admin/p2p-admin').then(m => m.P2pAdmin)
    },
    {
      path: "p2p-user",
      loadComponent: () => import('./p2p-user/p2p-user').then(m => m.P2pUser)
    },
    {
      path: "dex-screener",
      loadComponent: () => import('./dex-screener/dex-screener').then(m => m.DexScreener)
    },
  ]
}];
