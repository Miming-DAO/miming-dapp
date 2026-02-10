import { Component, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../services/auth/auth.service';
import { UsersService } from '../../../../services/users/users.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-p2p-admin-header',
  imports: [CommonModule],
  templateUrl: './p2p-admin-header.html',
  styleUrl: './p2p-admin-header.css',
})
export class P2pAdminHeader {
  currentUser = signal<User | null>(null);
  isP2PAdminLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    // Check if user is already logged in
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    const googleUser = localStorage.getItem('google_user');
    if (googleUser) {
      try {
        const userData = JSON.parse(googleUser);
        this.isP2PAdminLoggedIn = true;

        this.currentUser.set({
          id: userData.user._id,
          email: userData.user.email,
          full_name: userData.user.full_name,
          username: userData.user.email,
          type: 'User',
          is_disabled: false,
          photo_url: userData.user.photo_url,
          google_account_id: userData.user.google_account_id,
        });
      } catch (error) {
        console.error('Failed to parse google_user data:', error);
        localStorage.removeItem('google_user');
      }
    }
  }

  goBackToP2P(): void {
    this.router.navigate(['/dapp/p2p']);
  }

  logout() {
    // Clear authentication data
    localStorage.removeItem('google_user');

    // Reset state
    this.isP2PAdminLoggedIn = false;
    this.currentUser.set(null);

    // Navigate to login or home page
    this.router.navigate(['/dapp/p2p']);
  }
}
