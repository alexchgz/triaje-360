import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectDetailsTabsComponent } from './subject-details-tabs.component';

describe('SubjectDetailsTabsComponent', () => {
  let component: SubjectDetailsTabsComponent;
  let fixture: ComponentFixture<SubjectDetailsTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectDetailsTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectDetailsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
