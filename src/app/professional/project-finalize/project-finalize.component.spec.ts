import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFinalizeComponent } from './project-finalize.component';

describe('ProjectFinalizeComponent', () => {
  let component: ProjectFinalizeComponent;
  let fixture: ComponentFixture<ProjectFinalizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFinalizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFinalizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
