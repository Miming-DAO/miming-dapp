import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pAdminUserManagement } from './p2p-admin-user-management';

describe('P2pAdminUserManagement', () => {
  let component: P2pAdminUserManagement;
  let fixture: ComponentFixture<P2pAdminUserManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pAdminUserManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2pAdminUserManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
