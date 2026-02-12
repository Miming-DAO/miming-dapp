import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InjectedAccountWithMeta as PolkadotWalletAccount } from '@polkadot/extension-inject/types';
import { web3FromSource } from '@polkadot/extension-dapp';

import { TabsModule as PTabsModule } from 'primeng/tabs';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule as PToastModule } from 'primeng/toast';
import { TooltipModule as PTooltipModule } from 'primeng/tooltip';

import { AuthService } from '../../../../services/auth/auth.service';
import { AuthGoogleService } from '../../../../services/auth-google/auth-google.service';
import { AuthWalletService } from '../../../../services/auth-wallet/auth-wallet.service';
import { UsersService } from '../../../../services/users/users.service';
import { PolkadotJsService } from '../../../../services/polkadot-js/polkadot-js.service';
import { DeviceDetectorService } from '../../../../services/device-detector/device-detector.service';
import { User } from '../../../../models/user.model';
import { PolkadotIdenticonUtil } from '../../../shared/polkadot-identicon-util/polkadot-identicon-util';

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
    PToastModule,
    PTooltipModule,
    PolkadotIdenticonUtil
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  providers: [MessageService],
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
  isMobileDevice: boolean = false;

  // Web3 Wallet properties
  showLoginMethodDialog: boolean = false;
  showAvailableWalletsDialog: boolean = false;
  showPolkadotWalletAccountsDialog: boolean = false;
  showPolkadotWalletAccountDialog: boolean = false;
  polkadotWalletAccounts: PolkadotWalletAccount[] = [];
  selectedPolkadotWalletAccount: PolkadotWalletAccount | undefined;
  connectedPolkadotWalletAccount: PolkadotWalletAccount | undefined;
  isProcessing: boolean = false;
  loginType: 'traditional' | 'google' | 'wallet' | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private authGoogleService: AuthGoogleService,
    private authWalletService: AuthWalletService,
    private usersService: UsersService,
    private polkadotJsService: PolkadotJsService,
    private deviceDetectorService: DeviceDetectorService,
    private messageService: MessageService
  ) {
    this.isMobileDevice = this.deviceDetectorService.isMobile();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isXteriumMode = params['xterium'] === 'true';
    });

    // Check if user is already logged in
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    // Check Google auth
    const googleUser = localStorage.getItem('google_user');
    if (googleUser) {
      try {
        const userData = JSON.parse(googleUser);
        this.isP2PUserLoggedIn = true;
        this.loginType = 'google';

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

    // Check wallet auth
    const walletAuth = localStorage.getItem('wallet_auth');
    const walletAddress = localStorage.getItem('wallet_address');
    if (walletAuth && walletAddress) {
      try {
        const authData = JSON.parse(walletAuth);
        const walletData = JSON.parse(walletAddress);
        this.isP2PUserLoggedIn = true;
        this.loginType = 'wallet';
        this.connectedPolkadotWalletAccount = walletData;

        this.currentUser.set({
          id: authData.user._id,
          email: authData.user.email,
          full_name: authData.user.full_name,
          username: authData.user.username,
          type: authData.user.type,
          is_disabled: false,
          photo_url: authData.user.photo_url,
          google_account_id: authData.user.google_account_id,
        });
      } catch (error) {
        console.error('Failed to parse wallet auth data:', error);
        localStorage.removeItem('wallet_auth');
        localStorage.removeItem('wallet_address');
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
    this.showLoginMethodDialog = true;
  }

  selectLoginMethod(method: 'traditional' | 'google' | 'wallet'): void {
    this.showLoginMethodDialog = false;
    if (method === 'traditional') {
      this.showLoginDialog = true;
    } else if (method === 'google') {
      this.handleGoogleLogin();
    } else if (method === 'wallet') {
      this.showAvailableWalletsDialog = true;
    }
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

  // Web3 Wallet Methods
  async connectPolkadotJsWallet() {
    try {
      const results: PolkadotWalletAccount[] = await this.polkadotJsService.connectToWallet('polkadot-js');
      this.polkadotWalletAccounts = results;
      this.selectedPolkadotWalletAccount = this.polkadotWalletAccounts[0];

      this.showAvailableWalletsDialog = false;
      this.showPolkadotWalletAccountsDialog = true;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to connect: ' + (error as Error).message
      });
    }
  }

  async connectTalismanWallet() {
    try {
      const results: PolkadotWalletAccount[] = await this.polkadotJsService.connectToWallet('talisman');
      this.polkadotWalletAccounts = results;
      this.selectedPolkadotWalletAccount = this.polkadotWalletAccounts[0];

      this.showAvailableWalletsDialog = false;
      this.showPolkadotWalletAccountsDialog = true;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to connect: ' + (error as Error).message
      });
    }
  }

  async connectXteriumWallet() {
    try {
      if (this.isMobileDevice) {
        const callbackUrl = window.location.origin + '/p2p/marketplace';
        window.location.href = 'https://deeplink.xterium.app/web3/connect-accounts?origin=' + encodeURIComponent(window.location.origin) + '&callbackUrl=' + encodeURIComponent(callbackUrl);
      } else {
        const results = await this.polkadotJsService.connectToWallet('xterium');
        this.polkadotWalletAccounts = results;
        this.selectedPolkadotWalletAccount = this.polkadotWalletAccounts[0];

        this.showAvailableWalletsDialog = false;
        this.showPolkadotWalletAccountsDialog = true;
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to connect: ' + (error as Error).message
      });
    }
  }

  async connectPolkadotWalletAccount(): Promise<void> {
    if (!this.selectedPolkadotWalletAccount) return;

    this.isProcessing = true;
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      // Step 1: Request nonce from backend
      const nonceResponse = await this.authWalletService.generateNonce({
        wallet_address: this.selectedPolkadotWalletAccount.address,
        wallet_type: 'polkadot'
      }).toPromise();

      if (!nonceResponse) {
        throw new Error('Failed to generate nonce');
      }

      // Step 2: Sign the message with the wallet
      const injector = await web3FromSource(this.selectedPolkadotWalletAccount.meta.source);
      if (!injector?.signer?.signRaw) {
        throw new Error('Wallet does not support message signing');
      }

      const signResult = await injector.signer.signRaw({
        address: this.selectedPolkadotWalletAccount.address,
        data: nonceResponse.nonce,
        type: 'bytes'
      });

      // Step 3: Verify signature with backend
      const verifyResponse = await this.authWalletService.verifySignature({
        wallet_address: this.selectedPolkadotWalletAccount.address,
        nonce: nonceResponse.nonce,
        signature: signResult.signature
      }).toPromise();

      if (!verifyResponse) {
        throw new Error('Failed to verify signature');
      }

      // Step 4: Store authentication data
      localStorage.setItem('access_token', verifyResponse.access_token);
      localStorage.setItem('wallet_auth', JSON.stringify(verifyResponse));
      localStorage.setItem('wallet_address', JSON.stringify(this.selectedPolkadotWalletAccount));

      // Update state
      this.connectedPolkadotWalletAccount = this.selectedPolkadotWalletAccount;
      this.isP2PUserLoggedIn = true;
      this.loginType = 'wallet';
      this.loginP2PUserOnClick.emit();

      this.currentUser.set({
        id: verifyResponse.user._id,
        email: verifyResponse.user.email,
        full_name: verifyResponse.user.full_name,
        username: verifyResponse.user.username,
        type: verifyResponse.user.type,
        is_disabled: false,
        photo_url: verifyResponse.user.photo_url,
        google_account_id: verifyResponse.user.google_account_id,
      });

      // Close dialogs
      this.showPolkadotWalletAccountsDialog = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Connected',
        detail: 'Wallet authenticated successfully'
      });

    } catch (error) {
      console.error('Wallet authentication failed:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Authentication Failed',
        detail: (error as Error).message || 'Failed to authenticate wallet'
      });
    } finally {
      this.isProcessing = false;
      this.isLoading.set(false);
    }
  }

  getPolkadotWalletAccount(): void {
    this.showPolkadotWalletAccountDialog = true;
  }

  logoutPolkadotWalletAccount(): void {
    this.isProcessing = true;
    this.connectedPolkadotWalletAccount = undefined;

    setTimeout(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('wallet_auth');
      localStorage.removeItem('wallet_address');

      this.showPolkadotWalletAccountDialog = false;
      this.isP2PUserLoggedIn = false;
      this.loginType = null;
      this.currentUser.set(null);
      this.logoutP2PUserOnClick.emit();

      this.messageService.add({
        severity: 'success',
        summary: 'Disconnected',
        detail: 'Wallet disconnected successfully'
      });

      this.isProcessing = false;
      this.router.navigate(['/p2p/marketplace']);
    }, 500);
  }

  copyAddressToClipboard(address?: string): void {
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copied',
        detail: 'Address copied to clipboard'
      });
    });
  }

  logoutP2PUser(): void {
    // Clear all authentication data
    localStorage.removeItem('google_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('wallet_auth');
    localStorage.removeItem('wallet_address');

    // Reset state
    this.isP2PUserLoggedIn = false;
    this.loginType = null;
    this.currentUser.set(null);
    this.connectedPolkadotWalletAccount = undefined;
    this.logoutP2PUserOnClick.emit();

    this.router.navigate(['/p2p/marketplace']);
  }
}
