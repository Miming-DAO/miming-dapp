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

import { DeviceDetectorService } from '../../../services/device-detector/device-detector.service';
import { ChainsService } from '../../../services/chains/chains.service';
import { TokensService } from '../../../services/tokens/tokens.service';
import { PolkadotJsService } from '../../../services/polkadot-js/polkadot-js.service';
import { PolkadotXcmService } from '../../../services/polkadot-xcm/polkadot-xcm.service';
import { PolkadotApiService } from '../../../services/polkadot-api/polkadot-api.service';

import { CrossChainHeader } from './cross-chain-header/cross-chain-header';

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
    CrossChainHeader
  ],
  templateUrl: './cross-chain.html',
  styleUrl: './cross-chain.css',
  providers: [MessageService, ConfirmationService],
})
export class CrossChain {

  isMobileDevice: boolean = false;

  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private polkadotJsService: PolkadotJsService,
    private chainsService: ChainsService,
    private tokenService: TokensService,
    private polkadotApiService: PolkadotApiService,
    private polkadotXcmService: PolkadotXcmService,
    private messageService: MessageService
  ) {
    this.isMobileDevice = this.deviceDetectorService.isMobile();
  }

  menuItems: MenuItem[] | undefined;

  showInitializingDialog: boolean = true;
  currentPolkadotWalletAccount: PolkadotWalletAccount | undefined;

  isProcessing: boolean = false;

  showProcessingDialog: boolean = false;
  processingStatus: {
    message: string;
    details: string;
    status: string;
  } = { message: '', details: '', status: '' };

  showXteriumSignDialog: boolean = false;
  xteriumSignUrl: string = '';

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
          if (this.selectedTargetChain) {
            this.tokenService.getTokensByChainId(this.selectedTargetChain.id).subscribe({
              next: (targetChainTokens: Token[]) => {
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

    this.currentPolkadotWalletAccount = this.getCurrentPolkadotWalletAccount();
    if (!this.currentPolkadotWalletAccount) {
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

    const data: PolkadotXcm = {
      user: this.currentPolkadotWalletAccount?.address || "",
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

        if (this.isMobileDevice) {
          localStorage.setItem('ledger_id', ledger_id);

          const convertedAddress = this.polkadotJsService.encodePublicAddressByChainFormat(
            this.currentPolkadotWalletAccount!.address,
            this.selectedSourceChain!.address_prefix
          );
          const convertedHex = await this.polkadotJsService.normalizeToExtrinsicHex(extrinsicHex, this.selectedSourceChain!);

          this.showXteriumSignDialog = true;

          const signingType = "signTransactionHex";
          const payload = {
            address: convertedAddress,
            genesis_hash: this.selectedSourceChain!.genesis_hash,
            transaction_hex: convertedHex
          }
          const callbackUrl = window.location.origin + '/dapp/cross-chain-sign-transaction';

          this.xteriumSignUrl = 'https://deeplink.xterium.app/web3/sign-transaction?signingType=' + encodeURIComponent(signingType) + '&payload=' + encodeURIComponent(JSON.stringify(payload)) + '&callbackUrl=' + encodeURIComponent(callbackUrl);

          this.isProcessing = false;

          this.showProcessingDialog = false;
          this.processingStatus = {
            message: "",
            details: "",
            status: ""
          };

          return;
        }

        const signedExtrinsic = await this.polkadotJsService.signTransaction(
          this.currentPolkadotWalletAccount!,
          this.selectedSourceChain!,
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

  openXteriumSignWallet(): void {
    if (this.xteriumSignUrl) {
      window.location.href = this.xteriumSignUrl;
    }
  }

  ngOnInit() {
    this.menuItems = [
      { label: 'Teleport / Cross-Chain', routerLink: "" },
      { label: 'Staking', routerLink: "" }
    ];

    this.currentPolkadotWalletAccount = this.getCurrentPolkadotWalletAccount();
    this.getSourceChains();
  }
}
