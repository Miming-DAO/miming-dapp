import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossChainXteriumAccounts } from './cross-chain-xterium-accounts';

describe('CrossChainXteriumAccounts', () => {
  let component: CrossChainXteriumAccounts;
  let fixture: ComponentFixture<CrossChainXteriumAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrossChainXteriumAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrossChainXteriumAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
