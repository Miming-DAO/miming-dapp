import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DexScreener } from './dex-screener';

describe('DexScreener', () => {
  let component: DexScreener;
  let fixture: ComponentFixture<DexScreener>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DexScreener]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DexScreener);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
