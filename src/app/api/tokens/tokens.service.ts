import { Injectable } from '@angular/core';

import { Token } from '../../../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class TokensService {
  private polkadotNetworkId = 1;
  private assethubPolkadotNetworkId = 2;
  private xodePolkadotNetworkId = 3;
  // private solanaNetworkId = 4;

  private readonly tokens: Token[] = [
    {
      id: 1,
      reference_id: 0,
      network_id: this.polkadotNetworkId,
      name: "Polkadot",
      symbol: "DOT",
      decimals: 10,
      type: "native",
      image: "dot.png",
      target_networks: [
        this.assethubPolkadotNetworkId,
        this.xodePolkadotNetworkId,
      ]
    },
    {
      id: 2,
      reference_id: 0,
      network_id: this.assethubPolkadotNetworkId,
      name: "Assethub - Polkadot",
      symbol: "DOT",
      decimals: 10,
      type: "native",
      image: "dot.png",
      target_networks: [
        this.polkadotNetworkId,
      ]
    },
    {
      id: 3,
      reference_id: 1984,
      network_id: this.assethubPolkadotNetworkId,
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      type: "asset",
      image: "usdt.png",
      target_networks: [
        this.xodePolkadotNetworkId
      ]
    },
    {
      id: 4,
      reference_id: 0,
      network_id: this.xodePolkadotNetworkId,
      name: "Polkadot",
      symbol: "DOT",
      decimals: 10,
      type: "asset",
      image: "dot.png",
      target_networks: [
        this.polkadotNetworkId,
      ]
    },
    {
      id: 5,
      reference_id: 1984,
      network_id: this.xodePolkadotNetworkId,
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      type: "asset",
      image: "usdt.png",
      target_networks: [
        this.assethubPolkadotNetworkId
      ]
    },
    // {
    //   id: 6,
    //   reference_id: "So11111111111111111111111111111111111111111",
    //   network_id: this.xodePolkadotNetworkId,
    //   name: "Solana",
    //   symbol: "mSOL",
    //   decimals: 9,
    //   type: "asset",
    //   image: "msol.png",
    //   target_networks: [
    //     this.solanaNetworkId
    //   ]
    // },
    // {
    //   id: 7,
    //   reference_id: "So11111111111111111111111111111111111111111",
    //   network_id: this.solanaNetworkId,
    //   name: "Solana",
    //   symbol: "SOL",
    //   decimals: 9,
    //   type: "native",
    //   image: "sol.png",
    //   target_networks: [
    //     this.xodePolkadotNetworkId
    //   ]
    // },
  ];

  constructor() { }

  getAllTokens(): Token[] {
    return [...this.tokens];
  }
}
