import { TestBed } from '@angular/core/testing';
import { P2pUserOrderDetails } from './p2p-user-order-details';

describe('P2pUserOrderDetails', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pUserOrderDetails]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(P2pUserOrderDetails);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
