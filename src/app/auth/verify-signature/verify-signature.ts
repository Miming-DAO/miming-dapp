import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { InjectedAccountWithMeta as PolkadotWalletAccount } from '@polkadot/extension-inject/types';

import { MessageService } from 'primeng/api';
import { ToastModule as PToastModule } from 'primeng/toast';
import { DialogModule as PDialogModule } from 'primeng/dialog';

import { PolkadotIdenticonUtil } from './../../shared/polkadot-identicon-util/polkadot-identicon-util';

import { AuthWalletService } from '../../../services/auth-wallet/auth-wallet.service';

@Component({
  selector: 'app-verify-signature',
  imports: [
    CommonModule,
    PToastModule,
    PDialogModule,
    PolkadotIdenticonUtil
  ],
  templateUrl: './verify-signature.html',
  styleUrl: './verify-signature.css',
  providers: [MessageService],
})
export class VerifySignature {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authWalletService: AuthWalletService,
    private messageService: MessageService
  ) { }

  signature: string = '';
  walletName: string = '';
  walletAddress: string = '';
  nonce: string = '';
  selectedPolkadotWalletAccount: PolkadotWalletAccount | undefined;

  isProcessing: boolean = false;
  isVerified: boolean = false;

  loadSignatureData(): void {
    this.route.queryParams.subscribe(params => {
      this.signature = params['signature'] || '';

      const requestedSignRaw = localStorage.getItem('requested_sign_raw');
      if (requestedSignRaw) {
        const signData = JSON.parse(requestedSignRaw);
        this.walletName = signData.name || '';
        this.walletAddress = signData.address || '';
        this.nonce = signData.nonce || '';

        this.selectedPolkadotWalletAccount = {
          address: this.walletAddress,
          meta: {
            name: this.walletName,
            source: 'xterium'
          }
        };
      }
    });
  }

  async verifySignature(): Promise<void> {
    if (!this.signature || !this.walletAddress || !this.nonce) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Missing required signature data'
      });
      return;
    }

    this.isProcessing = true;

    try {
      const verifyResponse = await firstValueFrom(this.authWalletService.verifySignature({
        wallet_name: this.walletName,
        wallet_address: this.walletAddress,
        nonce: this.nonce,
        signature: this.signature
      }));

      if (!verifyResponse) {
        throw new Error('Failed to verify signature');
      }

      localStorage.setItem('auth_user', JSON.stringify(verifyResponse));
      localStorage.setItem('auth_wallet', JSON.stringify(this.selectedPolkadotWalletAccount));

      this.isVerified = true;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Signature verified successfully! Redirecting...'
      });

      localStorage.removeItem('requested_sign_raw');

      setTimeout(() => {
        this.router.navigate(['/cross-chain']);
      }, 2000);
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Verification Failed',
        detail: error?.error?.message || 'Failed to verify signature'
      });
      this.isProcessing = false;
    }
  }

  cancel(): void {
    localStorage.removeItem('requested_sign_raw');
    this.router.navigate(['/cross-chain']);
  }

  ngOnInit(): void {
    this.loadSignatureData();
  }
}
