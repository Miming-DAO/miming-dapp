import { TestBed } from '@angular/core/testing';

import { PolkadotXcmService } from './polkadot-xcm.service';

describe('PolkadotXcmService', () => {
  let service: PolkadotXcmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolkadotXcmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
