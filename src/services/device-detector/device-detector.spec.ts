import { TestBed } from '@angular/core/testing';

import { DeviceDetector } from './device-detector';

describe('DeviceDetector', () => {
  let service: DeviceDetector;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceDetector);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
