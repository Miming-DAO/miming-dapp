import { Injectable } from '@angular/core';

import { Network } from '../../../models/network.model';

@Injectable({
  providedIn: 'root'
})
export class NetworksService {
  private readonly networks: Network[] = [
    {
      id: 1,
      name: "Polkadot",
      unit: "DOT",
      decimal: 10,
      category: "Live",
      address_prefix: 0,
      image: "polkadot.png"
    },
    {
      id: 2,
      name: "AssetHub - Polkadot",
      unit: "DOT",
      decimal: 10,
      category: "Live",
      address_prefix: 0,
      image: "assethub.png"
    },
    {
      id: 3,
      name: "Xode - Polkadot",
      unit: "XON",
      decimal: 12,
      category: "Live",
      address_prefix: 280,
      image: "xode.png"
    },
    {
      id: 4,
      name: "Solana",
      unit: "SOL",
      decimal: 9,
      category: "Live",
      address_prefix: null,
      image: "solana.png"
    },
  ];

  constructor() { }

  getAllNetworks(): Network[] {
    return [...this.networks];
  }

  getNetworksByCategory(category: string): Network[] {
    return this.networks.filter(
      net => net.category.toLowerCase() === category.toLowerCase()
    );
  }

  getNetworkById(id: number): Network | undefined {
    return this.networks.find(network => network.id === id);
  }
}
