import { TestBed } from '@angular/core/testing';

import { AuthWalletService } from './auth-wallet.service';

describe('AuthWalletService', () => {
  let service: AuthWalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthWalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
