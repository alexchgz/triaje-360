import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSchoolYearsComponent } from './card-school-years.component';

describe('CardSchoolYearsComponent', () => {
  let component: CardSchoolYearsComponent;
  let fixture: ComponentFixture<CardSchoolYearsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSchoolYearsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSchoolYearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
