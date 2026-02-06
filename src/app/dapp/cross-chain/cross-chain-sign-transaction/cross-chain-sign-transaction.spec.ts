import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossChainSignTransaction } from './cross-chain-sign-transaction';

describe('CrossChainSignTransaction', () => {
  let component: CrossChainSignTransaction;
  let fixture: ComponentFixture<CrossChainSignTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrossChainSignTransaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrossChainSignTransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
