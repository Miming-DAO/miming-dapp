import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { InjectedAccountWithMeta as PolkadotWalletAccount } from '@polkadot/extension-inject/types';

import { MessageService } from 'primeng/api';
import { ToastModule as PToastModule } from 'primeng/toast';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { TooltipModule as PTooltipModule } from 'primeng/tooltip';

import { PolkadotIdenticonUtil } from '../../../shared/polkadot-identicon-util/polkadot-identicon-util';
import { DeviceDetectorService } from '../../../../services/device-detector/device-detector.service';
import { PolkadotJsService } from '../../../../services/polkadot-js/polkadot-js.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    PToastModule,
    PDialogModule,
    PTooltipModule,
    PolkadotIdenticonUtil
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  providers: [MessageService],
})
export class Header {

  isMobileDevice: boolean = false;

  constructor(
    private router: Router,
    private deviceDetectorService: DeviceDetectorService,
    private polkadotJsService: PolkadotJsService,
    private messageService: MessageService
  ) {
    this.isMobileDevice = this.deviceDetectorService.isMobile();
  }

  showAvailableWalletsDialog: boolean = false;
  showPolkadotWalletAccountsDialog: boolean = false;
  polkadotWalletAccounts: PolkadotWalletAccount[] = [];
  selectedPolkadotWalletAccount: PolkadotWalletAccount | undefined;
  connectedPolkadotWalletAccount: PolkadotWalletAccount | undefined;
  showPolkadotWalletAccountDialog: boolean = false;

  isProcessing: boolean = false;

  getCurrentPolkadotWalletAccount(): PolkadotWalletAccount | undefined {
    const storedAccount = localStorage.getItem('wallet_address');
    if (storedAccount) {
      return JSON.parse(storedAccount) as PolkadotWalletAccount;
    }

    return undefined;
  }

  connectWallet(): void {
    this.showAvailableWalletsDialog = true;
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

  connectPolkadotWalletAccount(): void {
    this.isProcessing = true;

    setTimeout(() => {
      this.connectedPolkadotWalletAccount = this.selectedPolkadotWalletAccount;
      localStorage.setItem('wallet_address', JSON.stringify(this.selectedPolkadotWalletAccount));

      this.showAvailableWalletsDialog = false;
      this.showPolkadotWalletAccountsDialog = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Connected',
        detail: 'Wallet connected successfully'
      });

      this.isProcessing = false;
    }, 500);
  }

  logoutPolkadotWalletAccount(): void {
    this.isProcessing = true;

    setTimeout(() => {
      localStorage.clear();
      this.showPolkadotWalletAccountDialog = false;
      this.connectedPolkadotWalletAccount = undefined;

      this.messageService.add({
        severity: 'success',
        summary: 'Disconnected',
        detail: 'Wallet disconnected successfully'
      });

      this.isProcessing = false;

      this.router.navigate(['/cross-chain']).then(() => {
        location.reload();
      });
    }, 500);
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

  navigateToCrossChain(): void {
    this.router.navigate(['/cross-chain']);
  }

  ngOnInit() {
    this.connectedPolkadotWalletAccount = this.getCurrentPolkadotWalletAccount();
  }
}
