import { TestBed } from '@angular/core/testing';

import { P2pAdsService } from './p2p-ads.service';

describe('P2pAdsService', () => {
  let service: P2pAdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P2pAdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
