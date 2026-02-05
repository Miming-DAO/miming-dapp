import { TestBed } from '@angular/core/testing';
import { P2pUserHeader } from './p2p-user-header';

describe('P2pUserHeader', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pUserHeader]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(P2pUserHeader);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
