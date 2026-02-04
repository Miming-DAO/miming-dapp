import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pHeader } from './p2p-header';

describe('P2pHeader', () => {
  let component: P2pHeader;
  let fixture: ComponentFixture<P2pHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2pHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
