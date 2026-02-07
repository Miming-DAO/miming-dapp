import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pMessages } from './p2p-messages';

describe('P2pMessages', () => {
  let component: P2pMessages;
  let fixture: ComponentFixture<P2pMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pMessages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2pMessages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
