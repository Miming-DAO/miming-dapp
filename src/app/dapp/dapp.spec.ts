import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dapp } from './dapp';

describe('Dapp', () => {
  let component: Dapp;
  let fixture: ComponentFixture<Dapp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dapp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dapp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
