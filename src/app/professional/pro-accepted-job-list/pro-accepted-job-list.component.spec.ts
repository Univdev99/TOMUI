import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProAcceptedJobListComponent } from './pro-accepted-job-list.component';

describe('ProAcceptedJobListComponent', () => {
  let component: ProAcceptedJobListComponent;
  let fixture: ComponentFixture<ProAcceptedJobListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProAcceptedJobListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProAcceptedJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
