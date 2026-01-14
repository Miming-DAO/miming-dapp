import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pMyAds } from './p2p-my-ads';

describe('P2pMyAds', () => {
  let component: P2pMyAds;
  let fixture: ComponentFixture<P2pMyAds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pMyAds]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2pMyAds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
