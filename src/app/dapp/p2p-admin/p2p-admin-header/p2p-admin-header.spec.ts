import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pAdminHeader } from './p2p-admin-header';

describe('P2pAdminHeader', () => {
  let component: P2pAdminHeader;
  let fixture: ComponentFixture<P2pAdminHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pAdminHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2pAdminHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
