import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSentCompletedComponent } from './project-sent-completed.component';

describe('ProjectSentCompletedComponent', () => {
  let component: ProjectSentCompletedComponent;
  let fixture: ComponentFixture<ProjectSentCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSentCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSentCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
