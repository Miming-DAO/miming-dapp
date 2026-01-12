import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossChain } from './cross-chain';

describe('CrossChain', () => {
  let component: CrossChain;
  let fixture: ComponentFixture<CrossChain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrossChain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrossChain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
