import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { InjectedAccountWithMeta as PolkadotWalletAccount } from '@polkadot/extension-inject/types';

import { ConfirmationService, MessageService } from 'primeng/api';
import { MenubarModule as PMenubarModule } from 'primeng/menubar';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { BadgeModule as PBadgeModule } from 'primeng/badge';
import { AvatarModule as PAvatarModule } from 'primeng/avatar';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ToastModule as PToastModule } from 'primeng/toast';
import { ConfirmDialog as PConfirmDialog } from 'primeng/confirmdialog';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { TooltipModule as PTooltipModule } from 'primeng/tooltip';

import { Router } from '@angular/router';

import { PolkadotJsService } from '../../../../services/polkadot-js/polkadot-js.service';

import { PolkadotIdenticonUtil } from '../../shared/polkadot-identicon-util/polkadot-identicon-util';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    PMenubarModule,
    PButtonModule,
    PBadgeModule,
    PAvatarModule,
    PInputTextModule,
    PToastModule,
    PConfirmDialog,
    PDialogModule,
    PTooltipModule,
    PolkadotIdenticonUtil
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  providers: [MessageService, ConfirmationService],
})
export class Header {

  constructor(
    private polkadotJsService: PolkadotJsService,

    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  @Output() onToggleSidebar = new EventEmitter<void>();

  photoUrl: string = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
  walletAddress: string = '';

  showAvailableWalletsDialog: boolean = false;
  showPolkadotWalletAccountsDialog: boolean = false;
  polkadotWalletAccounts: PolkadotWalletAccount[] = [];
  selectedPolkadotWalletAccount: PolkadotWalletAccount | undefined;
  showPolkadotWalletAccountDialog: boolean = false;

  isProcessing: boolean = false;

  toggleSidebar() {
    this.onToggleSidebar.emit();
  }

  toggleTheme(isDarkMode: boolean) {
    const element = document.querySelector('html') as HTMLElement;
    element.classList.toggle('my-app-dark');
  }

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

  connectPolkadotWalletAccount(): void {
    this.isProcessing = true;

    setTimeout(() => {
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

      this.messageService.add({
        severity: 'success',
        summary: 'Disconnected',
        detail: 'Wallet disconnected successfully'
      });

      this.isProcessing = false;
      location.reload();
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

  ngOnInit() {
    this.selectedPolkadotWalletAccount = this.getCurrentPolkadotWalletAccount();
  }
}
