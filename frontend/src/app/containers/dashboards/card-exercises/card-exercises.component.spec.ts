import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardExercisesComponent } from './card-exercises.component';

describe('CardExercisesComponent', () => {
  let component: CardExercisesComponent;
  let fixture: ComponentFixture<CardExercisesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardExercisesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardExercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
