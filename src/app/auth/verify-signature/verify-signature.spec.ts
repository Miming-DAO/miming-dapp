import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifySignature } from './verify-signature';

describe('VerifySignature', () => {
  let component: VerifySignature;
  let fixture: ComponentFixture<VerifySignature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifySignature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifySignature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
