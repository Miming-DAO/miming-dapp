import { Routes } from '@angular/router';
import { Dapp } from "./dapp"

export const routes: Routes = [{
  path: "",
  component: Dapp,
  children: [
    { path: '', redirectTo: '/dapp/home', pathMatch: 'full' },
    {
      path: "home",
      loadComponent: () => import('./home/home').then(m => m.Home)
    },
  ]
}];
