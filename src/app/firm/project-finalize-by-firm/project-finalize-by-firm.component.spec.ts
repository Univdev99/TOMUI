import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFinalizeByFirmComponent } from './project-finalize-by-firm.component';

describe('ProjectFinalizeByFirmComponent', () => {
  let component: ProjectFinalizeByFirmComponent;
  let fixture: ComponentFixture<ProjectFinalizeByFirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFinalizeByFirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFinalizeByFirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
