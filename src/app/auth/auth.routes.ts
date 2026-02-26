import { Routes } from '@angular/router';
import { Auth } from "./auth"

export const routes: Routes = [{
  path: "",
  component: Auth,
  children: [
    { path: '', redirectTo: '/auth/google-callback', pathMatch: 'full' },
    {
      path: "google-callback",
      loadComponent: () => import('./google-callback/google-callback').then(m => m.GoogleCallback)
    },
    {
      path: "xterium-accounts",
      loadComponent: () => import('./xterium-accounts/xterium-accounts').then(m => m.XteriumAccounts)
    },
    {
      path: "verify-signature",
      loadComponent: () => import('./verify-signature/verify-signature').then(m => m.VerifySignature)
    }
  ]
}];
