import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teleport } from './teleport';

describe('Teleport', () => {
  let component: Teleport;
  let fixture: ComponentFixture<Teleport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Teleport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teleport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
