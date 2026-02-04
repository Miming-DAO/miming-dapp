import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pAdmin } from './p2p-admin';

describe('P2pAdmin', () => {
  let component: P2pAdmin;
  let fixture: ComponentFixture<P2pAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2pAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
