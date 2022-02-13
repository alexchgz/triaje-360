import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSubjectModalComponent } from './manage-subject-modal.component';

describe('ManageSubjectModalComponent', () => {
  let component: ManageSubjectModalComponent;
  let fixture: ComponentFixture<ManageSubjectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSubjectModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSubjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
