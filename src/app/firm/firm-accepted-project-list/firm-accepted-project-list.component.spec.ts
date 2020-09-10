import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmAcceptedProjectListComponent } from './firm-accepted-project-list.component';

describe('FirmAcceptedProjectListComponent', () => {
  let component: FirmAcceptedProjectListComponent;
  let fixture: ComponentFixture<FirmAcceptedProjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmAcceptedProjectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmAcceptedProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
