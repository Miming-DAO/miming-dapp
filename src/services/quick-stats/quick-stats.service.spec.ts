import { TestBed } from '@angular/core/testing';

import { QuickStatsService } from './quick-stats.service';

describe('QuickStatsService', () => {
  let service: QuickStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuickStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
