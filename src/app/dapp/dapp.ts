import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InjectedAccountWithMeta as PolkadotWalletAccount } from '@polkadot/extension-inject/types';

import { MenuItem, MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';

import { Chain } from '../../models/chain.model';
import { Token } from '../../models/token.model';
import { PolkadotXcm } from '../../models/polkadot-xcm.model';
import { ExecuteTransaction } from '../../models/execute-transactions.model';

import { ChainsService } from '../api/chains/chains.service';
import { TokensService } from '../api/tokens/tokens.service';
import { PolkadotJsService } from '../api/polkadot-js/polkadot-js.service';
import { PolkadotXcmService } from '../api/polkadot-xcm/polkadot-xcm.service';
import { PolkadotApiService } from '../api/polkadot-api/polkadot-api.service';

import { PolkadotIdenticonUtil } from '../shared/polkadot-identicon-util/polkadot-identicon-util';

@Component({
  selector: 'app-dapp',
  imports: [
    CommonModule,
    FormsModule,
    MenubarModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
    ProgressSpinnerModule,
    CardModule,
    PanelModule,
    ToastModule,
    AccordionModule,
    PolkadotIdenticonUtil
  ],
  providers: [MessageService],
  templateUrl: './dapp.html',
  styleUrl: './dapp.scss'
})
export class Dapp {
  constructor(
    private polkadotJsService: PolkadotJsService,

    private chainsService: ChainsService,
    private tokenService: TokensService,

    private polkadotApiService: PolkadotApiService,
    private polkadotXcmService: PolkadotXcmService,

    private messageService: MessageService
  ) { }

  menuItems: MenuItem[] | undefined;

  showAvailableWalletsDialog: boolean = false;

  showPolkadotWalletAccountsDialog: boolean = false;
  polkadotWalletAccounts: PolkadotWalletAccount[] = [];
  selectedPolkadotWalletAccount: PolkadotWalletAccount | undefined;
  showPolkadotWalletAccountDialog: boolean = false;

  isProcessing: boolean = false;

  showProcessingDialog: boolean = false;
  processingStatus: {
    message: string;
    details: string;
    status: string;
  } = { message: '', details: '', status: '' };

  sourceChains: Chain[] = [];
  selectedSourceChain: Chain | undefined;

  targetChains: Chain[] = [];
  selectedTargetChain: Chain | undefined;

  tokens: Token[] = [];
  selectedToken: Token | undefined;

  quantity: number = 0.01;
  recipientAddress: string = 'XqDaorD7pcAHV1qatA4aKPV4wCwHeMbUdjbKNJ5RZcL9VpeSr';
  assetReceived: number = 0;

  getCurrentPolkadotWalletAccount(): PolkadotWalletAccount | undefined {
    const storedAccount = localStorage.getItem('polkadot_wallet_account');
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

  connectSolanaWallet(): void {

  }

  connectPolkadotWalletAccount(): void {
    this.isProcessing = true;

    setTimeout(() => {
      localStorage.setItem('polkadot_wallet_account', JSON.stringify(this.selectedPolkadotWalletAccount));

      this.showAvailableWalletsDialog = false;
      this.showPolkadotWalletAccountsDialog = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Connected',
        detail: 'Wallet connected successfully'
      });

      this.isProcessing = false;
    }, 1000);
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
    }, 1000);
  }

  getSourceChains(): void {
    this.chainsService.getChainsByNetworkId(1).subscribe({
      next: (chains: Chain[]) => {
        this.sourceChains = chains;
        this.selectedSourceChain = this.sourceChains[0] || undefined;

        this.getTargetChains();
      }
    });
  }

  getTargetChains(): void {
    if (this.sourceChains.length > 0) {
      this.chainsService.getChainsByNetworkId(1).subscribe({
        next: (chains: Chain[]) => {
          this.targetChains = chains.filter(chain => chain.id !== this.selectedSourceChain?.id);
          this.selectedTargetChain = this.targetChains[0];

          this.getTokens();
        }
      });
    }
  }

  getTokens(): void {
    if (this.selectedSourceChain) {
      this.tokenService.getTokensByChainId(this.selectedSourceChain.id).subscribe({
        next: (tokens: Token[]) => {
          this.tokens = tokens;
          this.selectedToken = this.tokens[0];
        }
      });
    }
  }

  isTeleportValid(): boolean {
    if (!this.selectedSourceChain && !this.selectedTargetChain) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select source and target chains.'
      });

      return false;
    }

    if (!this.selectedToken) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a token to teleport.'
      });

      return false;
    }

    if (this.quantity <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a valid quantity to teleport.'
      });

      return false;
    }

    if (!this.recipientAddress || this.recipientAddress.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a valid recipient address.'
      });

      return false;
    }

    if (!this.selectedPolkadotWalletAccount) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please connect and select a wallet account to sign the transaction.'
      });

      return false;
    }

    return true;
  }

  async teleport(): Promise<void> {
    if (!this.isTeleportValid()) {
      return;
    }

    this.isProcessing = true;

    this.showProcessingDialog = true;
    this.processingStatus = {
      message: "Preparing transaction...",
      details: "Please wait while we prepare your teleport transaction.",
      status: "In-Progress"
    };

    this.processingStatus = {
      message: "Creating transaction...",
      details: "Please wait while we create your teleport transaction.",
      status: "In-Progress"
    };

    const data: PolkadotXcm = {
      user: this.selectedPolkadotWalletAccount?.address || "",
      from_chain_id: this.selectedSourceChain?.id || 0,
      to_chain_id: this.selectedTargetChain?.id || 0,
      receiver: this.recipientAddress,
      token_id: this.selectedToken?.id || 0,
      amount: this.quantity * (10 ** (this.selectedToken?.decimals || 0))
    }

    this.polkadotXcmService.buildXcm(data).subscribe({
      next: async transactionResults => {
        const ledger_id = transactionResults._id;
        const extrinsicHex = transactionResults.extrinsic_hex as string;

        this.processingStatus = {
          message: "Signing transaction...",
          details: "Please sign the transaction in your wallet.",
          status: "In-Progress"
        };

        if (!this.selectedPolkadotWalletAccount) {
          this.isProcessing = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please connect and select a wallet account to sign the transaction.'
          });

          return;
        }

        if (!this.selectedSourceChain) {
          this.isProcessing = false;
          this.processingStatus = {
            message: "No source chain selected.",
            details: "Please select a source chain to sign the transaction.",
            status: "Error"
          };

          return;
        }

        const signedExtrinsic = await this.polkadotJsService.signTransaction(
          this.selectedPolkadotWalletAccount,
          this.selectedSourceChain,
          extrinsicHex
        );

        const executeData: ExecuteTransaction = {
          ledger_id: ledger_id,
          signed_extrinsic: signedExtrinsic
        };

        this.processingStatus = {
          message: "Submitting transaction...",
          details: "Please wait while we submit your teleport transaction.",
          status: "In-Progress"
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
            }
          },
          error: executionError => {
            console.log(executionError);

            this.isProcessing = false;
            this.processingStatus = {
              message: executionError.error.message,
              details: executionError.error.error,
              status: "Error"
            };
          }
        });
      },
      error: transactionError => {
        this.isProcessing = false;
        this.processingStatus = {
          message: transactionError.error.message,
          details: transactionError.error.error,
          status: "Error"
        };
      }
    });
  }

  closeProcessingDialog() {
    this.showProcessingDialog = false;
  }

  retryTransaction() {
    this.teleport();
  }

  ngOnInit() {
    this.menuItems = [
      { label: 'Teleport / Cross-Chain', routerLink: "" },
      { label: 'Staking', routerLink: "" }
    ];

    this.getSourceChains();
    this.selectedPolkadotWalletAccount = this.getCurrentPolkadotWalletAccount();
  }
}
