import { TestBed } from '@angular/core/testing';

import { ParachainsService } from './parachains.service';

describe('ParachainsService', () => {
  let service: ParachainsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParachainsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
