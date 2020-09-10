import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsWithScheduleComponent } from './project-details-with-schedule.component';

describe('ProjectDetailsWithScheduleComponent', () => {
  let component: ProjectDetailsWithScheduleComponent;
  let fixture: ComponentFixture<ProjectDetailsWithScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDetailsWithScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailsWithScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
