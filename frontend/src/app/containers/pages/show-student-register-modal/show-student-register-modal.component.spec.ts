import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowStudentRegisterModalComponent } from './show-student-register-modal.component';

describe('ShowStudentRegisterModalComponent', () => {
  let component: ShowStudentRegisterModalComponent;
  let fixture: ComponentFixture<ShowStudentRegisterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowStudentRegisterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowStudentRegisterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
