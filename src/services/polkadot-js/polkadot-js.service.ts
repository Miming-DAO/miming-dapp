import { Injectable } from '@angular/core';

import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { encodeAddress } from '@polkadot/util-crypto';
import { hexToU8a } from '@polkadot/util';
import { polkadotIcon } from '@polkadot/ui-shared';

import { Chain } from '../../models/chain.model';

@Injectable({
  providedIn: 'root'
})
export class PolkadotJsService {
  private appName = 'miming-dapp';
  private extensions = web3Enable(this.appName);

  constructor() { }

  async connectToWallet(wallet: string): Promise<InjectedAccountWithMeta[]> {
    if ((await this.extensions).length === 0) {
      throw new Error("No wallet extensions found. Please install a Polkadot wallet extension like Polkadot.js or Talisman.");
    }

    const allAccounts = await web3Accounts();
    if (allAccounts.length === 0) {
      throw new Error("No accounts found in the wallet. Please create an account in your Polkadot wallet extension.");
    }

    const accounts = allAccounts.filter(account => account.meta.source === wallet);
    if (accounts.length === 0) {
      throw new Error(`No accounts found for the selected wallet: ${wallet}. Please ensure you have accounts in that wallet.`);
    }

    return accounts
  }

  async signTransaction(account: InjectedAccountWithMeta, chain: Chain, transactionHex: string): Promise<string> {
    const injector = await web3FromSource(account.meta.source);
    if (!injector.signer) {
      throw new Error(`The selected wallet (${account.meta.source}) does not support signing transactions.`);
    }

    const wsProvider = new WsProvider(chain.rpc_url);
    const api = await ApiPromise.create({ provider: wsProvider });

    try {
      const txBytes = hexToU8a(transactionHex);
      const call = api.registry.createType('Call', txBytes);
      const tx = api.tx(call);

      const signedTx = await tx.signAsync(account.address, { signer: injector.signer });
      return signedTx.toHex();
    } catch (error) {
      throw error;
    } finally {
      await wsProvider.disconnect();
    }
  }

  async normalizeToExtrinsicHex(transactionHex: string, chain: Chain): Promise<string> {
    const wsProvider = new WsProvider(chain.rpc_url);
    const api = await ApiPromise.create({ provider: wsProvider });

    try {
      const txBytes = hexToU8a(transactionHex);
      const call = api.registry.createType('Call', txBytes);
      const tx = api.tx(call);

      return tx.toHex();
    } catch (error) {
      throw error;
    } finally {
      await wsProvider.disconnect();
    }
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
