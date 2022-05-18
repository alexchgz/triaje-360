import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriarPatientComponent } from './triar-patient.component';

describe('TriarPatientComponent', () => {
  let component: TriarPatientComponent;
  let fixture: ComponentFixture<TriarPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriarPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriarPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
