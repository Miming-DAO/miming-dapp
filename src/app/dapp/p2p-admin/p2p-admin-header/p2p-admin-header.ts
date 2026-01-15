import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-p2p-admin-header',
  imports: [],
  templateUrl: './p2p-admin-header.html',
  styleUrl: './p2p-admin-header.css',
})
export class P2pAdminHeader {
  constructor(
    private router: Router
  ) { }

  goBackToP2P(): void {
    this.router.navigate(['/dapp/p2p']);
  }

  logout() {
    // Clear any stored authentication data
    // Navigate to login or home page
    this.router.navigate(['/login']); // or '/home' depending on your app structure
  }
}
