import { Injectable } from '@angular/core';

import { Parachain } from '../../../models/parachain.model';

@Injectable({
  providedIn: 'root'
})
export class ParachainsService {
  private polkadotNetworkId = 1;
  private assethubPolkadotNetworkId = 2;
  private xodePolkadotNetworkId = 3;

  private readonly parachains: Parachain[] = [
    {
      id: 1,
      network_id: this.polkadotNetworkId,
      para_id: 0,
    },
    {
      id: 2,
      network_id: this.assethubPolkadotNetworkId,
      para_id: 1000,
    },
    {
      id: 3,
      network_id: this.xodePolkadotNetworkId,
      para_id: 3417,
    },
  ];

  constructor() { }

  getAllParachains(): Parachain[] {
    return [...this.parachains];
  }

}
