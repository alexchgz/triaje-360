import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocatePatientComponent } from './locate-patient.component';

describe('LocatePatientComponent', () => {
  let component: LocatePatientComponent;
  let fixture: ComponentFixture<LocatePatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocatePatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocatePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
