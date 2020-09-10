import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMeetingByProComponent } from './schedule-meeting-by-pro.component';

describe('ScheduleMeetingByProComponent', () => {
  let component: ScheduleMeetingByProComponent;
  let fixture: ComponentFixture<ScheduleMeetingByProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleMeetingByProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleMeetingByProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
