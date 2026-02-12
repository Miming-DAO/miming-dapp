import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TabsModule as PTabsModule } from 'primeng/tabs';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';

import { AuthService } from '../../../../services/auth/auth.service';
import { AuthGoogleService } from '../../../../services/auth-google/auth-google.service';
import { UsersService } from '../../../../services/users/users.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    FormsModule,
    PTabsModule,
    PDialogModule,
    PInputTextModule,
    PButtonModule,
    PSelectModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() mobileMenuOpen: boolean = false;

  @Output() mobileMenuOpenOnClick = new EventEmitter<boolean>();
  @Output() loginP2PUserOnClick = new EventEmitter<void>();
  @Output() logoutP2PUserOnClick = new EventEmitter<void>();

  showLoginDialog: boolean = false;
  loginEmail: string = '';
  loginPassword: string = '';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  currentUser = signal<User | null>(null);
  isP2PUserLoggedIn: boolean = false;
  isXteriumMode: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private authGoogleService: AuthGoogleService,
    private usersService: UsersService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isXteriumMode = params['xterium'] === 'true';
    });

    // Check if user is already logged in
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    const googleUser = localStorage.getItem('google_user');
    if (googleUser) {
      try {
        const userData = JSON.parse(googleUser);
        this.isP2PUserLoggedIn = true;

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

  fetchUserByEmail(email: string): void {
    this.usersService.getUserByEmail(email).subscribe({
      next: (user) => {
        this.currentUser.set(user);
      },
      error: (error) => {
        console.error('Failed to fetch user details:', error);
      }
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.mobileMenuOpenOnClick.emit(this.mobileMenuOpen);
  }

  loginP2PUser(): void {
    this.showLoginDialog = true;
  }

  handleLogin(): void {
    if (this.loginEmail && this.loginPassword) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.authService.login({
        username: this.loginEmail,
        password: this.loginPassword
      }).subscribe({
        next: (response) => {
          // Store token in localStorage
          localStorage.setItem('access_token', response.access_token);
          if (response.token_type) {
            localStorage.setItem('token_type', response.token_type);
          }

          // Store user email for later fetching
          localStorage.setItem('user_email', this.loginEmail);

          // Update login state
          this.isP2PUserLoggedIn = true;
          this.loginP2PUserOnClick.emit();

          // Fetch user details
          this.fetchUserByEmail(this.loginEmail);

          // Close dialog and reset form
          this.showLoginDialog = false;
          this.loginEmail = '';
          this.loginPassword = '';
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.message || 'Login failed. Please check your credentials.');
          console.error('Login failed:', error);
        }
      });
    }
  }

  handleGoogleLogin(): void {
    // Directly redirect to Google OAuth endpoint
    window.location.href = this.authGoogleService.getGoogleAuthUrl();
  }

  logoutP2PUser(): void {
    // Clear authentication data
    localStorage.removeItem('google_user');

    // Reset state
    this.isP2PUserLoggedIn = false;
    this.currentUser.set(null);
    this.logoutP2PUserOnClick.emit();

    this.router.navigate(['/p2p/marketplace']);
  }
}
