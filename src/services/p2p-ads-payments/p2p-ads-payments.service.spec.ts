import { TestBed } from '@angular/core/testing';

import { P2pAdsPaymentsService } from './p2p-ads-payments.service';

describe('P2pAdsPaymentsService', () => {
  let service: P2pAdsPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P2pAdsPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
