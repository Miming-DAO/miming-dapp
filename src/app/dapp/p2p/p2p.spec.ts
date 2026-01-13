import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2p } from './p2p';

describe('P2p', () => {
  let component: P2p;
  let fixture: ComponentFixture<P2p>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2p]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2p);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
