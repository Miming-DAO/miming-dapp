import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { InjectedAccountWithMeta as PolkadotWalletAccount } from '@polkadot/extension-inject/types';

import { MessageService } from 'primeng/api';
import { ToastModule as PToastModule } from 'primeng/toast';

import { CrossChainHeader } from '../cross-chain-header/cross-chain-header';
import { PolkadotIdenticonUtil } from '../../shared/polkadot-identicon-util/polkadot-identicon-util';

@Component({
  selector: 'app-cross-chain-xterium-accounts',
  imports: [
    CommonModule,
    PToastModule,
    PolkadotIdenticonUtil,
    CrossChainHeader
  ],
  templateUrl: './cross-chain-xterium-accounts.html',
  styleUrl: './cross-chain-xterium-accounts.css',
  providers: [MessageService],
})
export class CrossChainXteriumAccounts {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  polkadotWalletAccounts: PolkadotWalletAccount[] = [];
  selectedPolkadotWalletAccount: PolkadotWalletAccount | undefined;

  isProcessing: boolean = false;

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

  connectPolkadotWalletAccount(): void {
    if (!this.selectedPolkadotWalletAccount) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select an account'
      });
      return;
    }

    this.isProcessing = true;

    setTimeout(() => {
      localStorage.setItem('wallet_address', JSON.stringify(this.selectedPolkadotWalletAccount));

      this.messageService.add({
        severity: 'success',
        summary: 'Connected',
        detail: 'Wallet connected successfully'
      });

      this.isProcessing = false;

      // Navigate back to cross-chain page
      this.router.navigate(['/dapp/cross-chain']);
    }, 500);
  }

  cancel(): void {
    this.router.navigate(['/dapp/cross-chain']);
  }

  ngOnInit(): void {
    this.loadAccounts();
  }
}
