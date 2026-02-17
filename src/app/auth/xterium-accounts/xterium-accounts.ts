import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { InjectedAccountWithMeta as PolkadotWalletAccount } from '@polkadot/extension-inject/types';

import { MessageService } from 'primeng/api';
import { ToastModule as PToastModule } from 'primeng/toast';
import { DialogModule as PDialogModule } from 'primeng/dialog';

import { PolkadotIdenticonUtil } from './../../shared/polkadot-identicon-util/polkadot-identicon-util';

import { PolkadotJsService } from '../../../services/polkadot-js/polkadot-js.service';
import { AuthWalletService } from '../../../services/auth-wallet/auth-wallet.service';

@Component({
  selector: 'app-xterium-accounts',
  imports: [
    CommonModule,
    PToastModule,
    PDialogModule,
    PolkadotIdenticonUtil
  ],
  templateUrl: './xterium-accounts.html',
  styleUrl: './xterium-accounts.css',
  providers: [MessageService],
})
export class XteriumAccounts {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private polkadotJsService: PolkadotJsService,
    private authWalletService: AuthWalletService,
    private messageService: MessageService
  ) { }

  polkadotWalletAccounts: PolkadotWalletAccount[] = [];
  selectedPolkadotWalletAccount: PolkadotWalletAccount | undefined;

  isProcessing: boolean = false;

  showXteriumSignDialog: boolean = false;
  generatedNonce: string = '';
  xteriumSignUrl: string = '';

  loadAccounts(): void {
    this.route.queryParams.subscribe(params => {
      if (params['selectedAccounts']) {
        const selectedAccounts = decodeURIComponent(params['selectedAccounts']);
        const selectedAccountsArray = JSON.parse(selectedAccounts);

        if (selectedAccountsArray.length > 0) {
          this.polkadotWalletAccounts = [];

          for (const account of selectedAccountsArray) {
            this.polkadotWalletAccounts.push({
              address: account.address,
              meta: {
                name: account.name,
                source: 'xterium'
              },
              type: undefined
            });
          }

          this.selectedPolkadotWalletAccount = this.polkadotWalletAccounts[0];
        }
      }
    });
  }

  async connectPolkadotWalletAccount(): Promise<void> {
    if (!this.selectedPolkadotWalletAccount) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select an account'
      });
      return;
    }

    this.isProcessing = true;

    const nonceResponse = await firstValueFrom(this.authWalletService.generateNonce({
      wallet_address: this.selectedPolkadotWalletAccount.address,
      wallet_type: 'polkadot'
    }));

    this.generatedNonce = nonceResponse.nonce;

    const convertedAddress = this.polkadotJsService.encodePublicAddressByChainFormat(
      this.selectedPolkadotWalletAccount!.address,
      280
    );

    this.showXteriumSignDialog = true;

    const signingType = "signRaw";
    const payload = {
      address: convertedAddress,
      data: this.generatedNonce
    }
    const callbackUrl = window.location.origin + '/auth/verify-signature';

    this.xteriumSignUrl = 'https://deeplink.xterium.app/web3/sign-transaction?signingType=' + encodeURIComponent(signingType) + '&payload=' + encodeURIComponent(JSON.stringify(payload)) + '&callbackUrl=' + encodeURIComponent(callbackUrl);
    localStorage.setItem('requested_sign_raw', JSON.stringify({
      name: this.selectedPolkadotWalletAccount.meta.name,
      address: this.selectedPolkadotWalletAccount.address,
      nonce: this.generatedNonce
    }));

    this.isProcessing = false;
  }

  openXteriumSignWallet(): void {
    if (this.xteriumSignUrl) {
      window.location.href = this.xteriumSignUrl;
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copied',
        detail: 'Message copied to clipboard'
      });
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to copy message'
      });
    });
  }

  cancel(): void {
    this.router.navigate(['/cross-chain']);
  }

  ngOnInit(): void {
    this.loadAccounts();
  }
}
