export interface PolkadotWalletAccount {
  address: string;
  name: string;
  type: string;
}

export interface PolkadotWallet {
  name: string;
  version: string;
  signer: any;
  provider: any;
  title: string;
  accounts: PolkadotWalletAccount[];
}
