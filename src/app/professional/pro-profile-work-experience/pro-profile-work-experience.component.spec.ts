import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProProfileWorkExperienceComponent } from './pro-profile-work-experience.component';

describe('ProProfileWorkExperienceComponent', () => {
  let component: ProProfileWorkExperienceComponent;
  let fixture: ComponentFixture<ProProfileWorkExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProProfileWorkExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProProfileWorkExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
