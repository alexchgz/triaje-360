import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewExerciseModalComponent } from './add-new-exercise-modal.component';

describe('AddNewExerciseModalComponent', () => {
  let component: AddNewExerciseModalComponent;
  let fixture: ComponentFixture<AddNewExerciseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewExerciseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewExerciseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
