import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pMarketplace } from './p2p-marketplace';

describe('P2pMarketplace', () => {
  let component: P2pMarketplace;
  let fixture: ComponentFixture<P2pMarketplace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pMarketplace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2pMarketplace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
