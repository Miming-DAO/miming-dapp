import { TestBed } from '@angular/core/testing';

import { P2pOrdersService } from './p2p-orders.service';

describe('P2pOrdersService', () => {
  let service: P2pOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P2pOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
