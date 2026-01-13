import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InjectedAccountWithMeta as PolkadotWalletAccount } from '@polkadot/extension-inject/types';

import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { MenubarModule as PMenubarModule } from 'primeng/menubar';
import { SelectModule as PSelectModule } from 'primeng/select';
import { InputGroupModule as PInputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule as PInputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule as PInputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule as PProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule as PCardModule } from 'primeng/card';
import { PanelModule as PPanelModule } from 'primeng/panel';
import { AccordionModule as PAccordionModule } from 'primeng/accordion';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { BadgeModule as PBadgeModule } from 'primeng/badge';
import { AvatarModule as PAvatarModule } from 'primeng/avatar';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ToastModule as PToastModule } from 'primeng/toast';
import { ConfirmDialog as PConfirmDialog } from 'primeng/confirmdialog';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { TooltipModule as PTooltipModule } from 'primeng/tooltip';

import { Chain } from '../../../models/chain.model';
import { Token } from '../../../models/token.model';
import { PolkadotXcm } from '../../../models/polkadot-xcm.model';
import { ExecuteTransaction } from '../../../models/execute-transactions.model';

import { ChainsService } from '../../../services/chains/chains.service';
import { TokensService } from '../../../services/tokens/tokens.service';
import { PolkadotJsService } from '../../../services/polkadot-js/polkadot-js.service';
import { PolkadotXcmService } from '../../../services/polkadot-xcm/polkadot-xcm.service';
import { PolkadotApiService } from '../../../services/polkadot-api/polkadot-api.service';

import { PolkadotIdenticonUtil } from '../shared/polkadot-identicon-util/polkadot-identicon-util';

declare global {
  interface Window {
    xterium?: any;
  }
}

@Component({
  selector: 'app-cross-chain',
  imports: [
    CommonModule,
    FormsModule,
    PMenubarModule,
    PSelectModule,
    PInputGroupModule,
    PInputGroupAddonModule,
    PInputNumberModule,
    PProgressSpinnerModule,
    PCardModule,
    PPanelModule,
    PAccordionModule,
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
  templateUrl: './cross-chain.html',
  styleUrl: './cross-chain.css',
  providers: [MessageService, ConfirmationService],
})
export class CrossChain {
  constructor(
    private polkadotJsService: PolkadotJsService,

    private chainsService: ChainsService,
    private tokenService: TokensService,

    private polkadotApiService: PolkadotApiService,
    private polkadotXcmService: PolkadotXcmService,

    private messageService: MessageService
  ) { }

  menuItems: MenuItem[] | undefined;

  photoUrl: string = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
  walletAddress: string = '';

  showAvailableWalletsDialog: boolean = false;
  showPolkadotWalletAccountsDialog: boolean = false;
  polkadotWalletAccounts: PolkadotWalletAccount[] = [];
  selectedPolkadotWalletAccount: PolkadotWalletAccount | undefined;
  showPolkadotWalletAccountDialog: boolean = false;

  isProcessing: boolean = false;

  showInitializingDialog: boolean = true;

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

  quantity: number = 0;
  recipientAddress: string = '';

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
        next: (sourceChainTokens: Token[]) => {
          console.log('Source Chain Tokens:', sourceChainTokens);

          if (this.selectedTargetChain) {
            this.tokenService.getTokensByChainId(this.selectedTargetChain.id).subscribe({
              next: (targetChainTokens: Token[]) => {
                console.log('Target Chain Tokens:', targetChainTokens);

                const targetSymbols = new Set(targetChainTokens.map(token => token.symbol));
                this.tokens = sourceChainTokens.filter(token => targetSymbols.has(token.symbol));
                this.selectedToken = this.tokens[0];
              }
            });
          }

          setTimeout(() => {
            this.showInitializingDialog = false;
          }, 1000);
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

    this.selectedPolkadotWalletAccount = this.getCurrentPolkadotWalletAccount();
    this.getSourceChains();
  }
}
