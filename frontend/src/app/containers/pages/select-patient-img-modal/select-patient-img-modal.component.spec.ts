import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPatientImgModalComponent } from './select-patient-img-modal.component';

describe('SelectPatientImgModalComponent', () => {
  let component: SelectPatientImgModalComponent;
  let fixture: ComponentFixture<SelectPatientImgModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPatientImgModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPatientImgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
