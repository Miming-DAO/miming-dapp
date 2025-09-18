import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolkadotIdenticonUtil } from './polkadot-identicon-util';

describe('PolkadotIdenticonUtil', () => {
  let component: PolkadotIdenticonUtil;
  let fixture: ComponentFixture<PolkadotIdenticonUtil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolkadotIdenticonUtil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolkadotIdenticonUtil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
