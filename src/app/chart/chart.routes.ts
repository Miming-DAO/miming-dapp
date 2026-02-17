import { Routes } from '@angular/router';
import { Chart } from "./chart"

export const routes: Routes = [{
  path: "",
  component: Chart,
  children: [
    { path: '', redirectTo: '/chart/dex-screener', pathMatch: 'full' },
    {
      path: "dex-screener",
      loadComponent: () => import('./dex-screener/dex-screener').then(m => m.DexScreener)
    },
  ]
}];
