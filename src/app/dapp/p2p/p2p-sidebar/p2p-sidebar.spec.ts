import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pSidebar } from './p2p-sidebar';

describe('P2pSidebar', () => {
  let component: P2pSidebar;
  let fixture: ComponentFixture<P2pSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2pSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
