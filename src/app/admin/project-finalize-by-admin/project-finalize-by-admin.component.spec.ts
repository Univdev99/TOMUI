import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFinalizeByAdminComponent } from './project-finalize-by-admin.component';

describe('ProjectFinalizeByAdminComponent', () => {
  let component: ProjectFinalizeByAdminComponent;
  let fixture: ComponentFixture<ProjectFinalizeByAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFinalizeByAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFinalizeByAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
