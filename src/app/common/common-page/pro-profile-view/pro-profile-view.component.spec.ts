import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProProfileViewComponent } from './pro-profile-view.component';

describe('ProProfileViewComponent', () => {
  let component: ProProfileViewComponent;
  let fixture: ComponentFixture<ProProfileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProProfileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
