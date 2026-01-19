import { TestBed } from '@angular/core/testing';

import { P2pAdPaymentTypes } from './p2p-ad-payment-types';

describe('P2pAdPaymentTypes', () => {
  let service: P2pAdPaymentTypes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P2pAdPaymentTypes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
