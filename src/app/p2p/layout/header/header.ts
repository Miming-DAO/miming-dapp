import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';

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

import { DeviceDetectorService } from '../../../../services/device-detector/device-detector.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { AuthGoogleService } from '../../../../services/auth-google/auth-google.service';
import { AuthWalletService } from '../../../../services/auth-wallet/auth-wallet.service';
import { UsersService } from '../../../../services/users/users.service';
import { PolkadotJsService } from '../../../../services/polkadot-js/polkadot-js.service';

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

  isMobileDevice: boolean = false;

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

  isXteriumMode: boolean = false;

  isLoggedIn: boolean = false;
  currentUser: User | null = null;

  showAuthMethodDialog: boolean = false;

  showAvailableWalletsDialog: boolean = false;
  showPolkadotWalletAccountsDialog: boolean = false;
  polkadotWalletAccounts: PolkadotWalletAccount[] = [];
  selectedPolkadotWalletAccount: PolkadotWalletAccount | undefined;
  showPolkadotWalletAccountDialog: boolean = false;

  isProcessing: boolean = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.mobileMenuOpenOnClick.emit(this.mobileMenuOpen);
  }

  login(): void {
    this.showAuthMethodDialog = true;
  }

  selectAuthMethod(method: 'google' | 'wallet'): void {
    this.showAuthMethodDialog = false;

    if (method === 'google') {
      this.handleGoogleLogin();
    } else if (method === 'wallet') {
      this.showAvailableWalletsDialog = true;
    }
  }

  handleGoogleLogin(): void {
    window.location.href = this.authGoogleService.getGoogleAuthUrl();
  }

  async connectPolkadotJsWallet() {
    try {
      const results: PolkadotWalletAccount[] = await this.polkadotJsService.connectToWallet('polkadot-js');
      this.polkadotWalletAccounts = results;
      this.selectedPolkadotWalletAccount = this.polkadotWalletAccounts[0];

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
        const callbackUrl = window.location.origin + '/cross-chain/xterium-accounts';
        window.location.href = 'https://deeplink.xterium.app/web3/connect-accounts?origin=' + encodeURIComponent(window.location.origin) + '&callbackUrl=' + encodeURIComponent(callbackUrl);
      } else {
        const results = await this.polkadotJsService.connectToWallet('xterium');

        this.polkadotWalletAccounts = results;
        this.selectedPolkadotWalletAccount = this.polkadotWalletAccounts[0];

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

    try {
      const nonceResponse = await firstValueFrom(this.authWalletService.generateNonce({
        wallet_address: this.selectedPolkadotWalletAccount.address,
        wallet_type: 'polkadot'
      }));

      if (!nonceResponse) {
        throw new Error('Failed to generate nonce');
      }

      const injector = await web3FromSource(this.selectedPolkadotWalletAccount.meta.source);
      if (!injector?.signer?.signRaw) {
        throw new Error('Wallet does not support message signing');
      }

      const signResult = await injector.signer.signRaw({
        address: this.selectedPolkadotWalletAccount.address,
        data: nonceResponse.nonce,
        type: 'bytes'
      });

      const verifyResponse = await firstValueFrom(this.authWalletService.verifySignature({
        wallet_name: this.selectedPolkadotWalletAccount.meta.name || 'Unknown Polkadot Wallet',
        wallet_address: this.selectedPolkadotWalletAccount.address,
        nonce: nonceResponse.nonce,
        signature: signResult.signature
      }));

      if (!verifyResponse) {
        throw new Error('Failed to verify signature');
      }

      localStorage.setItem('auth_user', JSON.stringify(verifyResponse));

      this.isLoggedIn = true;
      this.currentUser = {
        id: verifyResponse.user._id,
        email: verifyResponse.user.email,
        full_name: verifyResponse.user.full_name,
        username: verifyResponse.user.username,
        type: verifyResponse.user.type,
        auth_type: verifyResponse.user.auth_type,
        is_disabled: false,
        photo_url: verifyResponse.user.photo_url,
        google_account_id: verifyResponse.user.google_account_id,
      };

      this.showPolkadotWalletAccountsDialog = false;
      this.showAvailableWalletsDialog = false;

      this.loginP2PUserOnClick.emit();

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
    }
  }

  getPolkadotWalletAccount(): void {
    this.showPolkadotWalletAccountDialog = true;
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

  logout(): void {
    this.isProcessing = true;

    setTimeout(() => {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('wallet_address');

      this.showPolkadotWalletAccountDialog = false;

      this.isLoggedIn = false;
      this.currentUser = null;

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

  checkAuthStatus(): void {
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      try {
        const userData = JSON.parse(authUser);

        this.isLoggedIn = true;
        this.currentUser = {
          id: userData.user._id,
          email: userData.user.email,
          full_name: userData.user.full_name,
          username: userData.user.email,
          type: userData.user.type,
          auth_type: userData.user.auth_type,
          is_disabled: false,
          photo_url: userData.user.photo_url,
          google_account_id: userData.user.google_account_id,
        };
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        localStorage.removeItem('auth_user');
      }
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isXteriumMode = params['xterium'] === 'true';
    });

    this.checkAuthStatus();
  }
}
