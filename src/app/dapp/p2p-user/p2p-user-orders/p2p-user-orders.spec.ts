import { TestBed } from '@angular/core/testing';
import { P2pUserOrders } from './p2p-user-orders';

describe('P2pUserOrders', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pUserOrders]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(P2pUserOrders);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
