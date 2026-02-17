import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XteriumAccounts } from './xterium-accounts';

describe('XteriumAccounts', () => {
  let component: XteriumAccounts;
  let fixture: ComponentFixture<XteriumAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XteriumAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XteriumAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
