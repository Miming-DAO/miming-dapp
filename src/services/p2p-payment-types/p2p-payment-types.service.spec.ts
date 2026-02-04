import { TestBed } from '@angular/core/testing';

import { P2pPaymentTypesService } from './p2p-payment-types.service';

describe('P2pPaymentTypesService', () => {
  let service: P2pPaymentTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P2pPaymentTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
