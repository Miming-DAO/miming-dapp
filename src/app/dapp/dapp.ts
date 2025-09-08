import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
import { ToastModule } from 'primeng/toast';

import { PolkadotWallet, PolkadotWalletAccount } from '../../models/wallet.model';
import { Network } from '../../models/network.model';
import { Token } from '../../models/token.model';
import { LimitedReserveTransferAssets } from '../../models/limited-reserve-transfer-assets.model';
import { ExecuteTransaction } from '../../models/execute-transactions.model';

import { PolkadotJsService } from '../api/polkadot-js/polkadot-js.service';
import { NetworksService } from '../api/networks/networks.service';
import { TokensService } from '../api/tokens/tokens.service';
import { PolkadotXcmService } from '../api/polkadot-xcm/polkadot-xcm.service';

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
    ToastModule,
    PolkadotIdenticonUtil
  ],
  providers: [MessageService],
  templateUrl: './dapp.html',
  styleUrl: './dapp.scss'
})
export class Dapp {
  constructor(
    private polkadotJsService: PolkadotJsService,
    private networksService: NetworksService,
    private tokenService: TokensService,
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

  sourceNetworks: Network[] = [];
  selectedSourceNetwork: Network | undefined;

  targetNetworks: Network[] = [];
  selectedTargetNetwork: Network | undefined;

  tokens: Token[] = [];
  selectedToken: Token | undefined;
  receivedToken: Token | undefined;

  quantity: number = 0;
  recipientAddress: string = '';
  assetReceived: number = 0;

  getCurrentWallet(): PolkadotWalletAccount | undefined {
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
      if (!this.polkadotJsService.isWalletInstalled('polkadot-js')) {
        const installUrl = this.polkadotJsService.getWalletInstallUrl('polkadot-js');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Polkadot-JS not installed. Install from: ' + installUrl
        });

        return;
      }

      const result: PolkadotWallet = await this.polkadotJsService.connectToWallet('polkadot-js');
      this.polkadotWalletAccounts = result.accounts;
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
      if (!this.polkadotJsService.isWalletInstalled('talisman')) {
        const installUrl = this.polkadotJsService.getWalletInstallUrl('talisman');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Talisman not installed. Install from: ' + installUrl
        });

        return;
      }

      const result: PolkadotWallet = await this.polkadotJsService.connectToWallet('talisman');
      this.polkadotWalletAccounts = result.accounts;
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

  connectPolkadotWalletAccount(polkadotWalletAccount: PolkadotWalletAccount): void {
    this.isProcessing = true;

    setTimeout(() => {
      localStorage.setItem('polkadot_wallet_account', JSON.stringify(polkadotWalletAccount));
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
      localStorage.removeItem('polkadot_wallet_account');
      this.showPolkadotWalletAccountDialog = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Disconnected',
        detail: 'Wallet disconnected successfully'
      });

      this.isProcessing = false;
    }, 1000);
  }

  getSourceNetworks(): void {
    this.sourceNetworks = this.networksService.getAllNetworks();
    this.selectedSourceNetwork = this.sourceNetworks[0];

    this.getTargetNetworks();
  }

  getTargetNetworks(): void {
    if (this.sourceNetworks.length > 0) {
      const networks = this.networksService.getAllNetworks();

      if (this.selectedSourceNetwork?.id === 1) {
        this.targetNetworks = networks.filter(net => net.id !== 1 && net.id !== 4);
        this.selectedTargetNetwork = this.targetNetworks[0];
      }

      if (this.selectedSourceNetwork?.id === 2) {
        this.targetNetworks = networks.filter(net => net.id !== 2 && net.id !== 4);
        this.selectedTargetNetwork = this.targetNetworks[0];
      }

      if (this.selectedSourceNetwork?.id === 3) {
        this.targetNetworks = networks.filter(net => net.id !== 3);
        this.selectedTargetNetwork = this.targetNetworks[0];
      }

      if (this.selectedSourceNetwork?.id === 4) {
        this.targetNetworks = networks.filter(net => net.id !== 4 && net.id !== 1 && net.id !== 2);
        this.selectedTargetNetwork = this.targetNetworks[0];
      }
    }

    this.getTokens();
  }

  getTokens(): void {
    const tokens = this.tokenService.getAllTokens();
    this.tokens = tokens.filter(
      tok => tok.network_id === this.selectedSourceNetwork?.id && tok.target_networks.filter(tn => tn === this.selectedTargetNetwork?.id).length > 0
    );
    this.selectedToken = this.tokens[0];
    this.getReceivedAsset();
  }

  getReceivedAsset(): void {
    if (this.selectedToken && this.selectedTargetNetwork) {
      const tokens = this.tokenService.getAllTokens();
      const targetTokens = tokens.filter(tok => tok.network_id === this.selectedTargetNetwork?.id);
      if (targetTokens.length > 0) {
        const receivingTokens = targetTokens.filter(tok => tok.target_networks.filter(tn => tn === this.selectedSourceNetwork?.id).length > 0);
        if (receivingTokens.length > 0) {
          this.receivedToken = receivingTokens.find(rt => rt.reference_id === this.selectedToken?.reference_id);
        }
      }
    }
  }

  ngOnInit() {
    this.menuItems = [
      { label: 'Teleport / Cross-Chain', routerLink: "" },
      { label: 'Staking', routerLink: "" }
    ];

    this.getSourceNetworks();
    this.selectedPolkadotWalletAccount = this.getCurrentWallet();
  }
}
