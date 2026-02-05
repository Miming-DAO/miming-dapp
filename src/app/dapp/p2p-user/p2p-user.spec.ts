import { TestBed } from '@angular/core/testing';
import { P2pUser } from './p2p-user';

describe('P2pUser', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pUser]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(P2pUser);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
