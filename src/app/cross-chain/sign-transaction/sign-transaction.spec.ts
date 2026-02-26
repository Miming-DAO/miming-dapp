import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignTransaction } from './sign-transaction';

describe('SignTransaction', () => {
  let component: SignTransaction;
  let fixture: ComponentFixture<SignTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignTransaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignTransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
