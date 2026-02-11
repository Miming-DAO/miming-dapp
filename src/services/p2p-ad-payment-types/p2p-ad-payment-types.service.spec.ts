import { TestBed } from '@angular/core/testing';

import { P2pAdPaymentTypesService } from './p2p-ad-payment-types.service';

describe('P2pAdPaymentTypesService', () => {
  let service: P2pAdPaymentTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P2pAdPaymentTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
