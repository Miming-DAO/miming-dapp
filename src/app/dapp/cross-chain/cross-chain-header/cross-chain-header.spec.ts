import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossChainHeader } from './cross-chain-header';

describe('CrossChainHeader', () => {
  let component: CrossChainHeader;
  let fixture: ComponentFixture<CrossChainHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrossChainHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrossChainHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
