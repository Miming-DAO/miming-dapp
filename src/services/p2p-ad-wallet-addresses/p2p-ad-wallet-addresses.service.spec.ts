import { TestBed } from '@angular/core/testing';

import { P2pAdWalletAddressesService } from './p2p-ad-wallet-addresses.service';

describe('P2pAdWalletAddresses', () => {
  let service: P2pAdWalletAddressesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P2pAdWalletAddressesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
