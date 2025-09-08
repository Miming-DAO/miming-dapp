import { Injectable } from '@angular/core';

import { encodeAddress } from '@polkadot/util-crypto';
import { polkadotIcon } from '@polkadot/ui-shared';

import { PolkadotWallet, PolkadotWalletAccount } from '../../../models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class PolkadotJsService {

  private walletExtensions: Record<'talisman' | 'polkadot-js', {
    extensionName: string;
    source: string;
    title: string;
    installUrl: string;
  }> = {
      'talisman': {
        extensionName: 'talisman',
        source: 'talisman',
        title: 'Talisman',
        installUrl: 'https://chrome.google.com/webstore/detail/talisman/fijngjgcjhjmmpcmkeiomlglpeiijkld'
      },
      'polkadot-js': {
        extensionName: 'polkadot-js',
        source: 'polkadot-js',
        title: 'Polkadot{.js}',
        installUrl: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd'
      }
    };

  private appName = 'miming-dapp';

  constructor() { }

  async connectToWallet(walletExtensionKey: string): Promise<PolkadotWallet> {
    const wallet = this.walletExtensions[walletExtensionKey as 'polkadot-js' | 'talisman'];
    if (!wallet) {
      throw new Error(`Unknown wallet: ${walletExtensionKey}`);
    }

    const injected = (window as any).injectedWeb3?.[wallet.source];
    if (!injected) {
      throw new Error(`${wallet.title} is not installed. Please install it from: ${wallet.installUrl}`);
    }

    try {
      let accounts = [];

      const extension = await injected.enable(this.appName);
      if (extension.accounts && typeof extension.accounts.get === 'function') {
        accounts = await extension.accounts.get();
      }

      if (!accounts || accounts.length === 0) {
        throw new Error(`No accounts found in ${wallet.title}. Make sure you have accounts in your wallet.`);
      }

      const polkadotAccounts: PolkadotWalletAccount[] = accounts.map((account: any) => ({
        address: account.address,
        name: account.name,
        type: account.type
      }));

      const polkadotWallet: PolkadotWallet = {
        name: wallet.source,
        version: injected.version || '1.0.0',
        signer: extension.signer,
        provider: extension.provider,
        title: wallet.title,
        accounts: polkadotAccounts
      }

      return polkadotWallet
    } catch (error) {
      throw new Error(`Error connecting to ${wallet.title}: ${(error as Error).message}`);
    }
  }

  isWalletInstalled(walletExtensionKey: string): boolean {
    const wallet = this.walletExtensions[walletExtensionKey as 'polkadot-js' | 'talisman'];
    if (!wallet) return false;

    return !!(window as any).injectedWeb3?.[wallet.source];
  }

  getWalletInstallUrl(walletExtensionKey: string): string | null {
    const wallet = this.walletExtensions[walletExtensionKey as 'polkadot-js' | 'talisman'];
    return wallet?.installUrl || null;
  }

  generateIdenticon(address: string, size = 32): string {
    const encoded = encodeAddress(address, 0);
    const circles = polkadotIcon(encoded, { isAlternative: false });

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
      ${circles.map(({ cx, cy, fill, r }) =>
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" />`
    ).join('')}
    </svg>`;

    return svg;
  }
}
