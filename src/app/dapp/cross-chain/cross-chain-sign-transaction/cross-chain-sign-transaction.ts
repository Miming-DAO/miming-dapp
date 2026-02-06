import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule as PProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule as PToastModule } from 'primeng/toast';

import { ExecuteTransaction } from '../../../../models/execute-transactions.model';
import { PolkadotApiService } from '../../../../services/polkadot-api/polkadot-api.service';

import { CrossChainHeader } from '../cross-chain-header/cross-chain-header';

@Component({
  selector: 'app-cross-chain-sign-transaction',
  imports: [
    CommonModule,
    PProgressSpinnerModule,
    PToastModule,
    CrossChainHeader
  ],
  templateUrl: './cross-chain-sign-transaction.html',
  styleUrl: './cross-chain-sign-transaction.css',
  providers: [MessageService],
})
export class CrossChainSignTransaction {

  signedTransactionHex: string = '';
  isProcessing: boolean = false;
  showSubmitButton: boolean = true;

  processingStatus: {
    message: string;
    details: string;
    status: string;
  } = { message: '', details: '', status: '' };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private polkadotApiService: PolkadotApiService,
    private messageService: MessageService
  ) { }

  loadSignedTransaction(): void {
    this.route.queryParams.subscribe(params => {
      if (params['signedTransactionHex']) {
        this.signedTransactionHex = decodeURIComponent(params['signedTransactionHex']);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No signed transaction found'
        });

        // Navigate back to cross-chain page
        setTimeout(() => {
          this.router.navigate(['/dapp/cross-chain']);
        }, 2000);
      }
    });
  }

  submitTransaction(): void {
    if (!this.signedTransactionHex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No signed transaction available'
      });
      return;
    }

    const walletAddress = localStorage.getItem('wallet_address');
    if (!walletAddress) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please connect and select a wallet account to sign the transaction.'
      });
      return;
    }

    const ledger_id = localStorage.getItem('ledger_id') || '';

    this.showSubmitButton = false;

    this.isProcessing = true;
    this.processingStatus = {
      message: "Submitting transaction...",
      details: "Please wait while we submit your teleport transaction.",
      status: "In-Progress"
    };

    const executeData: ExecuteTransaction = {
      ledger_id: ledger_id,
      signed_extrinsic: this.signedTransactionHex
    };

    this.polkadotApiService.executeTransaction(executeData).subscribe({
      next: executionResults => {
        if (executionResults.txhash !== "" && executionResults.status === "BROADCASTED") {
          this.isProcessing = false;
          this.processingStatus = {
            message: "Transaction submitted successfully.",
            details: "Your teleport transaction has been submitted.",
            status: "Completed"
          };

          // Navigate back to cross-chain page after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/dapp/cross-chain']);
          }, 3000);
        }
      },
      error: executionError => {
        console.log(executionError);

        this.isProcessing = false;
        this.processingStatus = {
          message: executionError.error?.message || 'Transaction failed',
          details: executionError.error?.error || 'An error occurred while submitting the transaction',
          status: "Error"
        };
      }
    });
  }

  retry(): void {
    this.showSubmitButton = true;
    this.processingStatus = { message: '', details: '', status: '' };
  }

  cancel(): void {
    this.router.navigate(['/dapp/cross-chain']);
  }

  ngOnInit(): void {
    this.loadSignedTransaction();
  }
}
