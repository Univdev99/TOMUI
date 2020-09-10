import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProProfileWorkAvailabilityComponent } from './pro-profile-work-availability.component';

describe('ProProfileWorkAvailabilityComponent', () => {
  let component: ProProfileWorkAvailabilityComponent;
  let fixture: ComponentFixture<ProProfileWorkAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProProfileWorkAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProProfileWorkAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
