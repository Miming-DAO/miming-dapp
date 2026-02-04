import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { P2pAdminHeader as P2pAdminHeaderComponent } from './p2p-admin-header/p2p-admin-header';
import { P2pAdminUserManagement as P2pAdminUserManagementComponent } from './p2p-admin-user-management/p2p-admin-user-management';

@Component({
  selector: 'app-p2p-admin',
  imports: [
    CommonModule,
    FormsModule,
    P2pAdminHeaderComponent,
    P2pAdminUserManagementComponent,
  ],
  templateUrl: './p2p-admin.html',
  styleUrl: './p2p-admin.css',
})
export class P2pAdmin implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    const googleUser = localStorage.getItem('google_user');
    if (!googleUser) {
      // Redirect to P2P page if not logged in
      this.router.navigate(['/dapp/p2p']);
    }
  }
}
