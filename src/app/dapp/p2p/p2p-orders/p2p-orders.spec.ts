import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pOrders } from './p2p-orders';

describe('P2pOrders', () => {
  let component: P2pOrders;
  let fixture: ComponentFixture<P2pOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2pOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
